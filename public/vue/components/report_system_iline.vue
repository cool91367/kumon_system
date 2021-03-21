<template>
    <div id="body" v-if="show">
        <h3>{{student.studentName}}</h3>
        <br>
        <div>
            <div id="flot-placeholder"></div>
            <form class="selectSubject">
                <div class="radio">
                    <label><input type="radio" name="selectSubject" value="math" @click="drawMath">數學</label>
                </div>
                <div class="radio">
                    <label><input type="radio" name="selectSubject" value="chinese" @click="drawChinese">國語</label>
                </div>
                <div class="radio">
                    <label><input type="radio" name="selectSubject" value="english" @click="drawEnglish">英文</label>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
module.exports = {
    data: function(){
        return {
            studentRecord: null,
            drawMathFlot: false,
            drawChineseFlot: false,
            drawEnglishFlot: false
        }
    },
    props: ["student", "show"],
    mounted: function() {
        let vm = this
        $.ajax({
            type: "GET",
            url: "/report/" + this.student.studentId,
            dataType: "json",
            headers : {
                "Authorization": Cookies.get("jwtToken")
            },
            success: function(response) {
                vm.studentRecord = response.progress;
            },
            error: function(err) {
                alert({err: err.message});
                return
            }
        });
    },
    watch: {
        student: function(newData) {
            let vm = this
            $.ajax({
                type: "GET",
                url: "/report/" + newData.studentId,
                dataType: "json",
                headers : {
                    "Authorization": Cookies.get("jwtToken")
                },
                success: function(response) {
                    vm.studentRecord = response.progress;
                    if(vm.drawMathFlot) {
                        drawFlot("math", vm.studentRecord, vm.$store.state.isTeacher)
                    }
                    if(vm.drawChineseFlot) {
                        drawFlot("chinese", vm.studentRecord, vm.$store.state.isTeacher)
                    }
                    if(vm.drawEnglishFlot) {
                        drawFlot("english", vm.studentRecord, vm.$store.state.isTeacher)
                    }
                },
                error: function(err) {
                    alert({err: err.message});
                    return
                }
            });
        }
    },
    methods: {
        drawMath() {
            this.drawMathFlot = true;
            this.drawChineseFlot = false;
            this.drawEnglishFlot = false;
            drawFlot("math", this.studentRecord, this.$store.state.isTeacher)
        },

        drawChinese() {
            this.drawMathFlot = false;
            this.drawChineseFlot = true;
            this.drawEnglishFlot = false;
            drawFlot("chinese", this.studentRecord, this.$store.state.isTeacher)
        },

        drawEnglish() {
            this.drawMathFlot = false;
            this.drawChineseFlot = false;
            this.drawEnglishFlot = true;
            drawFlot("english", this.studentRecord, this.$store.state.isTeacher)
        }
    }
}
function turnNum(progress){
        var level = progress.substring(0,1);
        var num = progress.substring(1 , progress.length);
        String.fromCharCode(level);
        return (level.charCodeAt(0) - "=".charCodeAt(0)) * 200 + Number(num);
    }
function turnString(progress){
    var level = String.fromCharCode(parseInt(progress / 200) + 61);
    var num = (progress % 200).toString();
    if(level == "="){
        level = "5A";
    }
    if(level == ">"){
        level = "4A";
    }
    if(level == "?"){
        level = "3A";
    }
    if(level == "@"){
        level = "2A";
    }
    return level + " " + num;
}
function replaceSubjectTitle(subject) {
    subject = subject.replace("5A", "=");
    subject = subject.replace("4A", ">");
    subject = subject.replace("3A", '?');
    subject = subject.replace("2A", "@");
    return subject;
}
function drawFlot(select, progress, isTeacher){
    var dataMath = [];
    var dataChinese = [];
    var dataEnglish = [];
    var dataILineMath = [];
    var dataILineMathYear = [];
    var dataILineMathMonth = [];
    var dataILineChinese = [];
    var dataILineChineseYear = [];
    var dataILineChineseMonth = [];
    var dataILineEnglish = [];
    var dataILineEnglishYear = [];
    var dataILineEnglishMonth = [];
    var dataset;
    let mathCount = 0;
    let chineseCount = 0;
    let englishCount = 0;
    for(i = 0;i < progress.length;i++){
        if(progress[i].progress.math) {
            dataMath.push([mathCount, turnNum(replaceSubjectTitle(progress[i].progress.math))]);
            dataILineMath.push([mathCount , turnNum(replaceSubjectTitle(progress[i].progress.ILine))]);
            dataILineMathYear.push(progress[i].year);
            dataILineMathMonth.push(progress[i].month);
            mathCount++;
        }
        if(progress[i].progress.chinese) {
            dataChinese.push([chineseCount, turnNum(replaceSubjectTitle(progress[i].progress.chinese))]);
            dataILineChinese.push([chineseCount , turnNum(replaceSubjectTitle(progress[i].progress.ILine))]);
            dataILineChineseYear.push(progress[i].year);
            dataILineChineseMonth.push(progress[i].month);
            chineseCount++;
        }
        if(progress[i].progress.english) {
            dataEnglish.push([englishCount, turnNum(replaceSubjectTitle(progress[i].progress.english))]);
            dataILineEnglish.push([englishCount , turnNum(replaceSubjectTitle(progress[i].progress.ILine))]);
            dataILineEnglishYear.push(progress[i].year);
            dataILineEnglishMonth.push(progress[i].month);
            englishCount++;
        }
    }
    // select subject
    if(select == "math"){
        dataset = [
            {
                label: "數學進度",
                color: "blue",
                data: dataMath
            },
            {
                label: "I線",
                color: "red",
                data: dataILineMath,
            }
        ];
    }
    else if(select == "chinese"){
        dataset = [
            {
                label: "國語進度",
                color: "yellow",
                data: dataChinese
            },
            {
                label: "I線",
                color: "red",
                data: dataILineChinese,
            }
        ];
    }
    else if(select == "english"){
        dataset = [
            {
                label: "英文進度",
                color: "pink",
                data: dataEnglish
            },
            {
                label: "I線",
                color: "red",
                data: dataILineEnglish,
            }
        ];
    }
    else{
        dataset = [
            {
                label: "數學進度",
                color: "blue",
                data: dataMath
            },
            {
                label: "I線",
                color: "red",
                data: dataILineMath,
            }
        ];
    }
    var options = {
        series: {  
            lines: { 
                show: true,
            },      
            points: {
                radius: 5,
                show: true
            },
        },
        xaxis:{
            tickSize: 1,
            tickFormatter: function (val, axis) {
                if(val == -1){
                    alert('資料不足，無法畫圖');
                }
                if(select == "math") {
                    return dataILineMathYear[val] + '年' + dataILineMathMonth[val] + '月';
                }
                else if(select == "chinese") {
                    return dataILineChineseYear[val] + '年' + dataILineChineseMonth[val] + '月';
                }
                else if(select == "english") {
                    return dataILineEnglishYear[val] + '年' + dataILineEnglishMonth[val] + '月';
                }
            },
            axisLabelUseCanvas: true,
        },
        yaxis: {
            tickFormatter: function (val, axis) {
                return turnString(val);
            },
            tickSize: 50,
        },
        grid: {
            hoverable: true,
            borderWidth: 3,
        }
    };
    $.plot($("#flot-placeholder"), dataset, options);
    $("#flot-placeholder").UseTooltip(isTeacher);
}
var previousPoint = null, previousLabel = null;
$.fn.UseTooltip = function (isTeacher) {
    $(this).bind("plothover", function (event, pos, item) {
        if (item) {
            if ((previousLabel != item.series.label) || (previousPoint != item.dataIndex)) {
                previousPoint = item.dataIndex;
                previousLabel = item.series.label;
                $("#tooltip").remove();

                var x = item.datapoint[0];
                var y = item.datapoint[1];
                var level = String.fromCharCode(parseInt(y/200) + 61);
                if(level == "="){
                    level = "5A";
                }
                if(level == ">"){
                    level = "4A";
                }
                if(level == "?"){
                    level = "3A";
                }
                if(level == "@"){
                    level = "2A";
                }
                var num = y % 200;

                var color = item.series.color;
                if (item.seriesIndex == 0) {
                    showTooltip(pos.pageX,
                    pos.pageY,
                    color,
                    "<strong>" + item.series.label + "</strong><br>" + " <strong>" + level + " " + num + "</strong>",
                    isTeacher);
                } 
                else if (item.seriesIndex == 1){
                    showTooltip(pos.pageX,
                    pos.pageY,
                    color,
                    "<strong>" + item.series.label + "</strong><br>" + " <strong>" + level + " " + num + "</strong>",
                    isTeacher);
                }
            }
        } 
        else {
            $("#tooltip").remove();
            previousPoint = null;
        }
    });
};
function showTooltip(x, y, color, contents, isTeacher) {
    $('<div id="tooltip">' + contents + '</div>').css({
        position: 'absolute',
        display: 'none',
        top: y-90, // 減的是navbar的高
        left: isTeacher? x-310 : x+10, //減的是studentlist的寬
        border: '2px solid ' + color,
        padding: '3px',
        'font-size': '9px',
        'border-radius': '5px',
        'background-color': '#fff',
        'font-family': 'Verdana, Arial, Helvetica, Tahoma, sans-serif',
        opacity: 0.9
    }).appendTo("#body").fadeIn(200);
}
</script>