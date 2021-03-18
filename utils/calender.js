
function GetDateMonthDay(mydate) { //获取当月日期
  var year = mydate.getFullYear();
  var month = mydate.getMonth();
  var months = month + 1;
  let _year = year;
  let _month = months;
  let today = mydate.getDate();
  var fist = new Date(year, month, 1);
  let firstDay = fist.getDay();
  var last = new Date(year, months, 0);
  let lastDay = last.getDate();

  let dateArr = []
  for (var i = 1; i < lastDay + 1; i++) {
    dateArr.push(i);
  }

  let dd = 7 - firstDay
  if (today > dd) {
    let num = Math.floor((today - dd) / 7)
    if ((today - dd) % 7 == 0) {
      num = num - 1
    }
    dateArr = dateArr.slice((num * 7) + dd)
  }


  let ym = _year + "年" + _month + "月"
  let themonth = { ym, dateArr, firstDay, "month": _month, "year": _year }
  let nextMonth = GetnextMonth(mydate)
  console.log(nextMonth)


  let thedatedata = { ymarr: [themonth, nextMonth], today, "selectday": today, "selectmonth": _month, "selectyear": _year, "selectdate": ym + today + "日" }
  // console.log(thedatedata)

  return thedatedata
}



function GetnextMonth(mydate) { //获取下一月日期
  var _year = mydate.getFullYear();
  var _month = mydate.getMonth();
  _month = _month + 1
  var months = "";
  var years = "";
  if (_month == 12) {
    _month = 0;
    months = _month;
    years = _year + 1;
  } else {
    months = _month + 1;
    years = _year;
  }
  var months = _month + 1;
  var first = new Date(years, months - 1, 1);
  let firstDay = first.getDay();
  var last = new Date(years, months, 0);
  let lastDay = last.getDate();
  let dateArr = [];
  for (var i = 1; i < lastDay + 1; i++) {
    dateArr.push(i);
  }
  let month_day = { "ym": years + "年" + months + "月", dateArr, firstDay, "month": months, "year": years }
  return month_day;
}


//计算当前时间点
function getNowTimes() {
  let now = new Date();
  // let currenttime = now.toLocaleTimeString('chinese', { hour12: false });
  let hours = now.getHours()
  let minutes = now.getMinutes()
  hours += 1
  if (hours == 24) {
    hours = 0
  }
  if (minutes < 30) {
    return hours + ":00"
  }
  else {
    return hours + ":30"
  }

}

module.exports = {
  getNowTimes:getNowTimes,
  GetDateMonthDay: GetDateMonthDay,
  GetnextMonth: GetnextMonth
}
