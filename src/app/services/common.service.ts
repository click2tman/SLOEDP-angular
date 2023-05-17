import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';

import * as parties from "../../assets/resources/all-political-parties.json";
import * as candidates from "../../assets/resources/all-candidates.json";
import { waterfall } from 'async';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  parties_json: any;
  candidates_json: any;
  polling_centres_json: any;
  results: any = {};
  whole_results: any = {};
  year: any;
  private granularitySubject = new Subject<any>();
  private $event = new Subject<EventCustom>()
  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) { }
  forward(page: string){
    this.navCtrl.navigateForward(page);
  }
  eventSet(value: EventCustom){
    this.$event.next(value)
  }
  eventPublish(): Observable<EventCustom> {
    return this.$event.asObservable();
  }
  back(){
    this.navCtrl.back();
  }
  root(path: string) {
    this.navCtrl.navigateRoot(path);
  }
  async showLoading(message?: string) {
    const loading = await this.loadingCtrl.create({
      message: message ?? 'Please wait..',
    });
    loading.present();
  }
  async presentAlertWithOk(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
  async hideLoading() {
    const loader = await this.loadingCtrl.getTop();
    if (loader) {
      loader.dismiss();
    }
  }
  getFileStatus(path: string) {}

  setYear(year: any) {
    this.year = year;
  }

  getYear() {
    return this.year ? this.year : "";
  }

  getParty(party: any) {
    return this.parties_json[party];
  }

  getCandidate(candidate_id: any) {
    return this.candidates_json[candidate_id];
  }

  loadWholeResults() {
    if (Object.keys(this.whole_results).length > 0) {
      return Promise.resolve(this.whole_results);
    } else {
      return new Promise((resolve) => {
        this.http
          .get("http://localhost:5000/election_results")
          .subscribe((response: any) => {
            this.whole_results = JSON.parse(response["_body"]);
            this.polling_centres_json = this.toPollingCentresJson(
              this.whole_results["polling_centre"]
            );
            resolve(this.whole_results);
          });
      });
    }
  }

  loadResultsByType(fields: any) {
    if (
      this.results[fields.type][fields.year] &&
      this.results[fields.type][fields.year]["all"]
    )
      return Promise.resolve(this.results[fields.type][fields.year]["all"]);

    return new Promise((resolve) => {
      this.loadWholeResults().then((data) => {
        var type_results = data[fields.type];
        this.results[fields.type][fields.year] = {};
        this.results[fields.type][fields.year]["all"] = this.getResultsByYear(
          type_results,
          fields.year
        );
        resolve("ok");
      });
    });
  }

  loadResultsByFields(fields: any) {
    var vm = this;

    return new Promise((resolve) => {
      waterfall(
        [
          function (callback: any) {
            if (
              !(vm.results[fields.type] && vm.results[fields.type][fields.year])
            ) {
              if (!vm.results[fields.type]) vm.results[fields.type] = {};
              vm.loadResultsByType(fields).then((data) => {
                callback(null);
              });
            } else callback(null);
          },
          function (callback: any) {
            if (fields.type == "president") {
              if (!vm.results[fields.type][fields.year][fields.region]) {
                vm.results[fields.type][fields.year][fields.region] = {};
              }
              if (
                !vm.results[fields.type][fields.year][fields.region][
                  fields.round
                ]
              )
                vm.results[fields.type][fields.year][fields.region][
                  fields.round
                ] = vm.makeResultsByBoundary(
                  vm.results[fields.type][fields.year]["all"],
                  fields
                );
            } else {
              if (!vm.results[fields.type][fields.year][fields.region]) {
                vm.results[fields.type][fields.year][fields.region] =
                  vm.makeResultsByBoundary(
                    vm.results[fields.type][fields.year]["all"],
                    fields
                  );
              }
            }

            var total_votes = 0;
            if (
              vm.results[fields.type][fields.year][fields.region].length > 0
            ) {
              vm.results[fields.type][fields.year][fields.region].forEach(
                function (value: any) {
                  total_votes += value["votes"];
                }
              );
            }

            var results =
              fields.type == "president"
                ? vm.results[fields.type][fields.year][fields.region][
                    fields.round
                  ]
                : vm.results[fields.type][fields.year][fields.region];

            callback(null, {
              ValidVotes: total_votes,
              Parties: vm.parties_json,
              Candidates: vm.candidates_json,
              Boundaries: results,
            });
          },
        ],
        function (err, result) {
          resolve(result);
        }
      );
    });
  }

  mergeResultsByBoundary(original_boundaries: any[], range: any, year: any) {
    var result_type: any = this.getResultType(range);
    var electionResults: any = [];
    var temp_election_results: any = {},
      BoundaryName,
      BoundaryKey,
      CandidateKey;
    for (let boundary of original_boundaries) {
      BoundaryName = this.getBoundaryName(boundary.candidates[0], {
        region: range,
        year: year,
      });
      BoundaryKey = this.makeKey(BoundaryName);
      if (!temp_election_results[BoundaryKey])
        temp_election_results[BoundaryKey] = {};
      for (let candidate of boundary.candidates) {
        CandidateKey = candidate["Candidate_SLEOP_ID"];
        if (!temp_election_results[BoundaryKey][CandidateKey])
          temp_election_results[BoundaryKey][CandidateKey] = Object.assign(
            {},
            candidate
          );
        else
          temp_election_results[BoundaryKey][CandidateKey]["ValidVotes"] +=
            candidate["ValidVotes"];
      }
    }

    var boundary_result, election_result;
    for (let key in temp_election_results) {
      boundary_result = temp_election_results[key];

      for (let key1 in boundary_result) {
        election_result = Object.assign({}, boundary_result[key1]);
        election_result["ResultType"] = result_type;
        electionResults.push(election_result);
      }
    }

    return electionResults;
  }

  makeResultsByBoundary(election_results: any, fields: any) {
    var boundary_results = this.getResultsByBoundary(
      election_results,
      fields.region
    );
    if (fields.type == "president")
      boundary_results = this.getResultsByRound(boundary_results, fields.round);

    var result_temp_boundaries: any = {},
      temp_candidates: any = {},
      temp_parties: any = {};
    var missing_parties: any = [],
      missing_names: any = [];
    var party,
      CandidateFullName,
      CandidateKey,
      BoundaryName,
      BoundaryKey,
      Votes,
      Latitude,
      Longitude,
      PollingCentreKey;

    for (let election_result of boundary_results) {
      party = election_result["CandidatePoliticalParty"];
      CandidateFullName =
        election_result["CandidateFirstName"].trim() +
        " " +
        election_result["CandidateSurname"].trim();

      if (party == "") {
        missing_parties.push(election_result);
        continue;
      }
      if (CandidateFullName == " ") {
        missing_names.push(election_result);
        continue;
      }

      CandidateKey = this.makeKey(CandidateFullName);
      if (!temp_candidates[CandidateKey]) temp_candidates[CandidateKey] = party;
      if (!temp_parties[party]) temp_parties[party] = CandidateFullName;

      Votes = Number(election_result["ValidVotes"]);
      BoundaryName = this.getBoundaryName(election_result, fields);
      BoundaryKey = this.makeKey(BoundaryName);
      if (
        election_result["PollingCentreName"] &&
        election_result["PollingCentreName"] != ""
      )
        PollingCentreKey = this.makeKey(election_result["PollingCentreName"]);

      Latitude = this.polling_centres_json[PollingCentreKey]
        ? this.polling_centres_json[PollingCentreKey]["PollingCentreLatitude"]
        : "";
      Longitude = this.polling_centres_json[PollingCentreKey]
        ? this.polling_centres_json[PollingCentreKey]["PollingCentreLongitude"]
        : "";

      if (BoundaryName != "") {
        if (!result_temp_boundaries[BoundaryKey]) {
          result_temp_boundaries[BoundaryKey] = {
            votes: Votes,
            name: BoundaryName,
            latitude: Latitude,
            longitude: Longitude,
            candidates: {},
          };
          if (fields.type == "mayor")
            result_temp_boundaries[BoundaryKey]["name_council"] =
              election_result["ElectionCouncil"];
          result_temp_boundaries[BoundaryKey]["candidates"][party] =
            Object.assign({}, election_result);
        } else {
          if (!result_temp_boundaries[BoundaryKey]["candidates"][party]) {
            if (
              fields.type == "mayor" &&
              election_result["ElectionCouncil"] != ""
            )
              result_temp_boundaries[BoundaryKey]["name_council"] =
                election_result["ElectionCouncil"];
            result_temp_boundaries[BoundaryKey]["candidates"][party] =
              Object.assign({}, election_result);
            result_temp_boundaries[BoundaryKey]["votes"] += Votes;
          }
        }

        result_temp_boundaries[BoundaryKey]["candidates"][party]["ValidVotes"] =
          Votes;
        result_temp_boundaries[BoundaryKey]["candidates"][party][
          "CandidateFullName"
        ] = CandidateFullName;
      }
    }

    for (let election_result of missing_parties) {
      CandidateFullName =
        election_result["CandidateFirstName"].trim() +
        " " +
        election_result["CandidateSurname"].trim();
      CandidateKey = this.makeKey(CandidateFullName);
      party = temp_candidates[CandidateKey];
      if (party) {
        Votes = Number(election_result["ValidVotes"]);
        BoundaryName = this.getBoundaryName(election_result, fields);
        BoundaryKey = this.makeKey(BoundaryName);

        if (
          result_temp_boundaries[BoundaryKey] &&
          !result_temp_boundaries[BoundaryKey]["candidates"][party]
        ) {
          if (
            fields.type == "mayor" &&
            election_result["ElectionCouncil"] != ""
          )
            result_temp_boundaries[BoundaryKey]["name_council"] =
              election_result["ElectionCouncil"];
          result_temp_boundaries[BoundaryKey]["candidates"][party] =
            Object.assign({}, election_result);
          result_temp_boundaries[BoundaryKey]["candidates"][party][
            "ValidVotes"
          ] = Votes;
          result_temp_boundaries[BoundaryKey]["candidates"][party][
            "CandidateFullName"
          ] = CandidateFullName;
          result_temp_boundaries[BoundaryKey]["votes"] += Votes;
        }
      }
    }

    for (let election_result of missing_names) {
      party = election_result["CandidatePoliticalParty"];
      if (temp_parties[party]) {
        Votes = Number(election_result["ValidVotes"]);
        BoundaryName = this.getBoundaryName(election_result, fields);
        BoundaryKey = this.makeKey(BoundaryName);

        if (
          result_temp_boundaries[BoundaryKey] &&
          !result_temp_boundaries[BoundaryKey]["candidates"][party]
        ) {
          if (
            fields.type == "mayor" &&
            election_result["ElectionCouncil"] != ""
          )
            result_temp_boundaries[BoundaryKey]["name_council"] =
              election_result["ElectionCouncil"];
          result_temp_boundaries[BoundaryKey]["candidates"][party] =
            Object.assign({}, election_result);
          result_temp_boundaries[BoundaryKey]["candidates"][party][
            "ValidVotes"
          ] = Votes;
          result_temp_boundaries[BoundaryKey]["candidates"][party][
            "CandidateFullName"
          ] = CandidateFullName;
          result_temp_boundaries[BoundaryKey]["votes"] += Votes;
        }
      }
    }

    var row, temp_candidate_ary, total_votes;
    for (let key1 in result_temp_boundaries) {
      temp_candidate_ary = [];
      row = result_temp_boundaries[key1]["candidates"];
      total_votes = result_temp_boundaries[key1]["votes"];
      for (let key2 in row) {
        row[key2]["ValidVotesPercentage"] =
          total_votes == 0
            ? 0
            : ((row[key2]["ValidVotes"] / total_votes) * 100).toFixed(2);
        temp_candidate_ary.push(row[key2]);
      }

      temp_candidate_ary.sort((a, b) => {
        var nameA = a.CandidatePoliticalParty.toUpperCase(); // ignore upper and lowercase
        var nameB = b.CandidatePoliticalParty.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });
      temp_candidate_ary.sort((a, b) => b.ValidVotes - a.ValidVotes);

      if (temp_candidate_ary[0].ValidVotes == 0)
        temp_candidate_ary[0].CandidatePoliticalPartyColor = "999";
      result_temp_boundaries[key1]["candidates"] = temp_candidate_ary;
    }

    return this.toArray(result_temp_boundaries);
  }

  getResultsByYear(results: any, year: any) {
    return results.filter((election_result: any) => {
      return year == election_result["ElectionDate"].substring(0, 4)
        ? election_result
        : "";
    });
  }

  getResultsByBoundary(election_results: any, boundary: any) {
    var result_type = this.getResultType(boundary);
    return election_results.filter((election_result: any) => {
      return election_result.ResultType == result_type ? election_result : "";
    });
  }

  getResultsByRound(election_results: any, round: any) {
    return election_results.filter(function (election_result: any) {
      return round == "second"
        ? election_result["ElectionRound"] == "Second Round"
        : election_result["ElectionRound"] != "Second Round";
    });
  }

  toPartiesJson(parties: any) {
    var parties_json: any = {};
    for (let party of parties) {
      parties_json[party["Acronym"]] = party;
    }
    return parties_json;
  }





  toCandidatesJson(candidates: any) {
    var candidates_json: any = {};
    for (let candidate of candidates) {
      candidates_json[candidate["CandidateSLEOP_ID"]] = candidate;
    }
    return candidates_json;
  }

  toPollingCentresJson(polling_centres: any) {
    var polling_centres_json: any = {},
      PollingCentreKey: any;
    for (let polling_centre of polling_centres) {
      PollingCentreKey = this.makeKey(polling_centre["PollingCentreName"]);
      polling_centres_json[PollingCentreKey] = polling_centre;
    }
    return polling_centres_json;
  }

  toArray(json: any) {
    var ary = [];
    for (let key in json) {
      ary.push(json[key]);
    }
    return ary;
  }

  makeKey(value: any) {
    return value.toLowerCase().replace(/\ /gi, "_");
  }

  getResultType(boundary: any) {
    var result_type = "";
    switch (boundary) {
      case "nation":
        result_type = "National Results";
        break;
      case "region":
        result_type = "Regional Results";
        break;
      case "district":
        result_type = "District Results";
        break;
      case "constituency":
        result_type = "Constituency Results";
        break;
      case "ward":
        result_type = "Ward Results";
        break;
      case "polling_centre":
        result_type = "Polling Centre Results";
        break;
      default:
        // code...
        break;
    }

    return result_type;
  }

  getBoundaryName(election_result: any, fields: any) {
    var boundary_field = "";
    var year = Number(fields.year);
    if (fields.region == "nation") return "Sierra Leone";
    else {
      switch (fields.region) {
        case "region":
          boundary_field = year < 2018 ? "ElectionRegion" : "ElectionRegion";
          break;
        case "district":
          boundary_field =
            year < 2018 ? "ElectionDistrict" : "ElectionDistrict";
          break;
        case "constituency":
          boundary_field =
            year < 2018 ? "ElectionConstituency" : "ElectionConstituency";
          break;
        case "ward":
          boundary_field = year < 2018 ? "ElectionWard" : "ElectionWard";
          break;
        case "polling_centre":
          boundary_field = "PollingCentreName";
          break;
        default:
          break;
      }
    }

    return election_result[boundary_field];
  }

  setGranularity(data: string) {
    this.granularitySubject.next(data);
  }
  getGranularity(): Observable<any> {
    return this.granularitySubject.asObservable();
  }
}
interface EventCustom {
  mode: string,
  value: any
}