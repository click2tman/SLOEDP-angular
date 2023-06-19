import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss'],
})
export class TableViewComponent  implements OnInit, AfterViewInit {
  @Input('year') year: any;
  @Input('region') region: any;
  @Input('type') type: any;
  round!: boolean;

  Parties: any;
  Candidates: any;
  total_results: any;
  Results: any;
  Boundaries: any;
  isNation!: boolean;
  Boundary!: any;
  noWinner!: boolean;
  isRoundAvailable!: boolean;

  result: any;
  two_rounds = [1996, 2007, 2018];
  constructor(
    private commonService: CommonService,
    private router: Router,
  ) { 
    this.Results = [];
    this.Boundaries = [];
    this.Parties = {};
    this.Candidates = {};
    this.noWinner = true;
    this.round = true;
    this.result = {
      'VotesCandidate': "Total",
      'PecentageCandidate': '100%',
      'ResultStatus': "",
      'TotalVotes': "",
      'ValidVotes': "",
      'InvalidVotes': "",
      'VotesPecentage': ""
    };
  }

  ngOnInit() {}
  ngAfterViewInit() {
    this.isRoundAvailable = this.type == 'president' && this.two_rounds.indexOf(this.year) != -1
    this.round = this.year == 2018;
  }
  candidatesEnable() {
    return this.Results.length > 0;
  }

  gotoPage(path: string, id: any){
    this.router.navigate([`${path}/${id}`]);
  }
  changeRound(round: any) {
    this.drawTable(this.Boundary)
  }

  drawTable(boundary: any) {
    if (boundary != "")
      this.Boundary = boundary;
    var fields: any = {
      year: this.year,
      type: this.type,
      region: this.region
    }
    if (this.type == 'president' && this.two_rounds.indexOf(this.year) != -1)
      fields['round'] = this.round ? 'second' : 'first'

    this.isNation = this.region == 'nation';

    var vm = this;
    this.commonService.loadResultsByFields(fields).then((data: any) => {
      this.Parties = data['Parties'];
      this.Candidates = data['Candidates'];
      this.total_results = data['Boundaries'];

      vm.result.TotalVotes = this.year == '2018' ? 3178664 : data['ValidVotes'];
      vm.result.InvalidVotes = this.year == '2018' ? 139427 : 0;
      vm.result.ResultStatus = "Final & Certified"
      
      vm.Results = [];
      vm.Boundaries = [];
      vm.result.ValidVotes = 0;
      vm.result.VotesPecentage = "0%";
      if (data['Boundaries'].length > 0) {
        vm.Results = data['Boundaries'][0].candidates;
        vm.result.ValidVotes = data['Boundaries'][0].votes;
        if (vm.year == '2018')
          if (vm.result.TotalVotes == 0)
            vm.result.VotesPecentage = "0%"
          else {
            vm.result.VotesPecentage = ((vm.result.ValidVotes / vm.result.TotalVotes) * 100).toFixed(2) + '%'
          }
        else
          vm.result.VotesPecentage = "100%"
        if (data['Boundaries'][0].votes > 0) vm.noWinner = false;
        else vm.noWinner = true;
        for (let row of data['Boundaries']) {
          if (this.type == 'mayor')
            vm.Boundaries.push({id: row.name, text: row.name_council});
          else
            vm.Boundaries.push({id: row.name, text: row.name});
        }
      }
    });
  }

  onSelectChange(selectedValue: any) {
    var vm = this;
    this.total_results.forEach(function(data : any) {
      if (data.name == selectedValue.value) {
        vm.Results = data.candidates;
        vm.result.ValidVotes = data.votes;
        if (vm.year == '2018')
          if (vm.result.TotalVotes == 0)
            vm.result.VotesPecentage = "0%"
          else {
            vm.result.VotesPecentage = ((vm.result.ValidVotes / vm.result.TotalVotes) * 100).toFixed(2) + '%'
          }
        else
          vm.result.VotesPecentage = "100%"
        if (data.votes > 0) vm.noWinner = false;
        else vm.noWinner = true;
        if (vm.Results[0]['ValidVotes'] > 0)
          vm.noWinner = false;
        else
          vm.noWinner = true;
      }
    });
  }
}
