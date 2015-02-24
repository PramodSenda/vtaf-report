var testSuites;
var testCases;

var testSuiteLength;
var testCasesLength;
var testStepsLength;
var testSuiteCount=0,testCaseCount=0,testStepCount=0;
var testSuiteStatus=false;
var testCaseStatus=false;
var testStepStatus=false;



function intializePieChart(failvalue, passvalue) {
    var data = [
        {
            value: parseInt(failvalue),
            color: "#F7464A",
            highlight: "#FF5A5E",
            label: "Fail"
            },
        {
            value: parseInt(passvalue),
            color: "#00b200",
            highlight: "#00cc00",
            label: "Pass"
            }
        ];

    var ctx = document.getElementById("myChart").getContext("2d");
    var myPieChart = new Chart(ctx).Pie(data);
}

function getJson() {
    var jsonObject;

    $.get('report.html.data', function (xml) {
        jsonObject = $.xml2json(xml, true);
        // console.log(jsonObject);
        createReport(jsonObject);
    });
}

function createReport(jsonObject) {

    intializePieChart(jsonObject.activity[0].totalfailedcount, jsonObject.activity[0].totalsuccesscount);

    $("#exetime").text(jsonObject.activity[0].timestamp);
    $("#osystem").text(jsonObject.activity[0].osversion);
    $("#lang").text(jsonObject.activity[0].language);
    $("#totalerror").text(jsonObject.activity[0].totalerrorcount);
    $("#cname").text(jsonObject.activity[0].host);
    $("#screensize").text(jsonObject.activity[0].screenresolution);
    $("#duration").text(jsonObject.activity[0].duration);
    $("#totalwarning").text(jsonObject.activity[0].totalwarningcount);

testSuites = jsonObject.activity[0].activity[0].activity;


 var tree = $("#tree");

testSuiteLength = testSuites.length 
bulidtree(tree,testSuites,"testsuite");

}


function bulidtree(tree,treeitem,type){
    


if(type=="testsuite"){
   if(testSuiteCount<testSuiteLength){
    testSuiteStatus=true;
    testSuite=treeitem[testSuiteCount];
    tree.append('<li>'+testSuite.foldername+'</li>');
    testSuiteCount++;
    testCases = testSuite.activity;
    testCaseLength = testCases.length
    //console.log(testCases);
    //console.log(testCaseLength);
    
   
    bulidtree(tree,testCases,"testcase"); //array of testcase of testsuite
   }
}
else if(type="testcase"){
    if(testCaseCount<testCaseLength){
      testCaseStatus=true;
      testCase=treeitem[testCaseCount];
      tree.append('<ul id="testcase"></ul>');
      var testCaseNode = $("#testcase");
      testCaseNode.append(testCase.testcasename);
      testCaseCount++;
      //teststeps = testcase.teststepArray;
      //teststepslength = teststeps.length
      //buildtree(teststeps,"teststep")

     }
}
else if(type=="teststep"){
 if(teststepcount<teststepslength){
   teststepstatus=true;
   teststep =  teststeps[teststepcount];                
   teststepcount++;
    if(teststep.type=="bComponent"){
    createBcomponent(bComponent);
    
    
    }else{
      testcase.append(testStep);
      
    }
 }
}
  if(testStepStatus){
    testStepStatus=false;
    buildtree(teststeps,"teststep");
    
    }
  else if(testCaseStatus){
    testCaseStatus=false;
    bulidtree(tree,testCases,"testcase");
    
  }else if(testSuiteStatus){
   testSuiteStatus=false;
   bulidtree(tree,testSuites,"testsuite");
   

  }  
    

}


function createBcomponent(bcomponent){
    testcase.append(bcomponent) ;//as UL list
    bcomponent.append(bcomponentteststep);

//expand/collapse ul list
$('.archive_month ul').hide();

$('.months').click(function () {
    $(this).find('ul').slideToggle();
});



//##############################################################


















// A $( document ).ready() block.
$(document).ready(function () {

    new jQueryCollapse($("#tree"), {
        query: 'div h2',
        open: function () {
            this.slideDown(150);
        },
        close: function () {
            this.slideUp(150);
        }
    });

    getJson();
});
