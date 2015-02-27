var testSuites,
    testCases,
    testSteps,
    testSuiteLength,
    testCasesLength,
    testStepsLength,
    testSuiteCount = 0,
    testCaseCount = 0,
    testStepCount = 0,
    testSuiteStatus = false,
    testCaseStatus = false,
    testStepStatus = false,
    TestSuiteID = 0,
    TestCaseID = 0,
    TestStepID = 0,
    bComponentID = 0,
    status;

function intializePieChart(failvalue, passvalue) {
    'use strict';
    var data = [{
        value: parseInt(failvalue),
        color: "#F7464A",
        highlight: "#FF5A5E",
        label: "Fail"
    }, {
        value: parseInt(passvalue),
        color: "#00b200",
        highlight: "#00cc00",
        label: "Pass"
    }];

    var ctx = document.getElementById("myChart").getContext("2d"),
        myPieChart = new Chart(ctx).Pie(data);

    $('#pass').text(' Pass : ' + passvalue);
    $('#fail').text(' Fail : ' + failvalue);
};

function getJson() {
    'use strict';
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
    bulidtree(tree, testSuites, "testsuite");
    treeBuild();

}


function bulidtree(tree, treeitem, type) {



    if (type === "testsuite") {
        if (testSuiteCount < testSuiteLength) {
            testSuiteStatus = true;
            testSuite = treeitem[testSuiteCount];

            if(testSuite.result==="Success"){
               status="success";
            }else{
               status="failed";
            }
            //tree.append('<h4>' + testSuite.foldername + '</h4>');
            tree.append('<div class="testSuite"><h2 data-status="' + status + '"><i class="glyphicon glyphicon-border glyphicon-plus"></i> ' + testSuite.foldername + '</h2><div id="testsuite' + TestSuiteID + '" class="testSuite"></div></div>');

            testSuiteCount++;
            TestSuiteID ++;
            testCases = testSuite.activity;
            testCaseCount = 0;
            TestStepID = 0;
            testCaseLength = testCases.length
                console.log(testCases);
                //console.log(testCaseLength);


            bulidtree(tree, testCases, "testcase"); //array of testcase of testsuite
        }
    } else if (type === "testcase") {
        if (testCaseCount < testCaseLength) {
            testCaseStatus = true;
            testCase = treeitem[testCaseCount];
            
            var testSuiteNode = $("#testsuite" + (TestSuiteID-1));
            if(testCase.result==="Success"){
               status="success";
            }else{
               status="failed";
            }

            var str = "";
            str += '<h2 data-status="'+status+'"><i class="glyphicon glyphicon-border glyphicon-plus"></i> ' + testCase.testcasename + '</h2>';
            str += "<div class=\"testCase col-md-12\">";
            str += '<table id="testcase' + TestCaseID + '" class="table col-md-12">';
            str += '<tr class="teststep">';
            str += '<th style="width:40px;">#</th>';
            str += '<th class="col-md-2">Time</th>';
            str += '<th class="col-md-2">Level</th>';
            str += '<th class="col-md-2">Action</th>';
            str += '<th class="col-md-8">Message</th>';
            str += "<\/tr>";
            str += "<\/table>";
            str += "<\/div>";
            str += "<p>***Test Area***<\/p>";
           

            testSuiteNode.append(str);

            testCaseCount ++;
            TestCaseID ++;
            //console.log(testCase.activity[0].item);
            testSteps = testCase.activity[0].item;
            testStepsLength = testSteps.length;
            testStepCount = 0;
            //console.log(testSteps);
            bulidtree(tree, testSteps, "teststep");

        }
    } else if (type === "teststep") {
        if (testStepCount < testStepsLength) {
            testStepStatus = true;
            testStep = testSteps[testStepCount];
            testStepCount++;
            //console.log(testStep);
            testCaseNode = $('#testcase' + (TestCaseID - 1) + ' tr[class="teststep"]:last');
            if(testStep.level==="Success"){
               status="success";
               }else{
               status="failed";
               }


            if (testStep.type === "bComponent") {
                var str = "";
                str += "<tr class=\"teststep\" id=\"teststep" + TestStepID + "\">";
                str += "<td>" + (TestStepID + 1) + "</td>";
                str += "<td class='bcompnent' colspan=\"4\">";
                str += '<h2 data-status="' + status + '"><i class="glyphicon glyphicon-border glyphicon-plus"></i> ' + testStep.category + '</h2>';
                str += "<div>";
                str += "<table id=\"bcomponent" + bComponentID + "\" class=\"table\"><tbody></tbody>";
                str += "<tr class=\"bcomponent\">";
                str += '<th style="width:40px;">#</th>';
                str += '<th class="col-md-2">Time</th>';
                str += '<th class="col-md-2">Level</th>';
                str += '<th class="col-md-2">Action</th>';
                str += '<th class="col-md-8">Message</th>';
                str += "<\/tr>";
                str += "<\/table>";
                str += "<\/div>";
                str += "<\/td>";
                str += "<\/tr>";

                $(str).insertAfter(testCaseNode);


                // testCaseNode.append('<li id="teststep'+TestStepID+'">'+testStep.category+'</li>');
                //testCaseNode.append(str);

                createBcomponent(testCaseNode, testStep);
                bComponentID++;

            } else {

               
                var str = '<tr class="teststep" data-status=\"'+status+'\" id="teststep' + TestStepID + '">';
                str += '<td>' + (TestStepID + 1) + '</td>';
                str += '<td>' + testStep.time + '</td>';
                str += '<td>' + testStep.level + '</td>';
                str += '<td>' + testStep.category + '</td>';
                str += '<td>' + testStep.message[0].text + '</td>';
                str += '</tr>';

                //testCaseNode.append('<tr><th>#</th><th>Time</th><th>Level</th><th>Action</th><th>Message</th></tr>');
                $(str).insertAfter(testCaseNode);
                // testCaseNode.append('<li id="teststep'+TestStepID+'">'+testStep.category+'</li>');

            }

            TestStepID++;
        }
    }
    if (testStepStatus) {
        testStepStatus = false;
        bulidtree(tree, testSteps, "teststep");

    } else if (testCaseStatus) {
        testCaseStatus = false;
        bulidtree(tree, testCases, "testcase");

    } else if (testSuiteStatus) {
        testSuiteStatus = false;
        bulidtree(tree, testSuites, "testsuite");


    }


}


function createBcomponent(testCaseNode, testStep) {

    var bComponentNode = $("#bcomponent" + bComponentID + " > tbody:last");

    var bCompItems = testStep.bitem;

    for (var c = 0; c < bCompItems.length; c++) {
        var bstep = (TestStepID + 1) + "." + (c + 1)
        var bcomp = bCompItems[c];

        if(bcomp.level==="Success"){
               status="success";
               }else{
               status="failed";
               }
        var strVar = "";
        strVar += "<tr data-status=\""+status+"\">";
        strVar += "<td>" + bstep + "<\/td>";
        strVar += "<td>" + bcomp.time + "<\/td>";
        strVar += "<td>" + bcomp.level + "<\/td>";
        strVar += "<td>" + bcomp.category + "<\/td>";
        strVar += "<td>" + bcomp.message[0].text + "<\/td>";
        strVar += "<\/tr>";

        //$( strVar ).insertAfter( bComponentNode );
        bComponentNode.append(strVar);

    }

}

function treeBuild() {
    new jQueryCollapse($("#tree"), {
        query: 'div h2',
        open: function () {
            this.slideDown(150);
        },
        close: function () {
            this.slideUp(150);
        }
    });

    //click event for expand tree [Test Suites]
    $('h2 > a').click(function (e) {
        var element = $(this).find('i');
        if (element.hasClass('glyphicon-plus')) {
            element.removeClass('glyphicon-plus').addClass('glyphicon-minus');
        } else {
            element.removeClass('glyphicon-minus').addClass('glyphicon-plus');
        }
    });
}

// A $( document ).ready() block.
$(document).ready(function () {
    getJson();

});
