var data = [
    {
        value: 2,
        color: "#F7464A",
        highlight: "#FF5A5E",
        label: "Fail"
            },
    {
        value: 7,
        color: "#00b200",
        highlight: "#00cc00",
        label: "Pass"
            }
        ];

var ctx = document.getElementById("myChart").getContext("2d");
var myPieChart = new Chart(ctx).Pie(data);