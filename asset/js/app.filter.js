app.filter("html", ['$sce', function($sce) {
    return function(htmlCode){
      return $sce.trustAsHtml(htmlCode);
    }
}]);

app.filter('timeChatBox', function(){
  return function(date) {
    if (!date) {
      return null;
    }
    let dateTime = new Date(date);
    let dateFormat = zeroLead(dateTime.getDate())
            +'/'+zeroLead(dateTime.getMonth() + 1)
            +'/'+dateTime.getFullYear()
            +" "+zeroLead(dateTime.getHours())
            +':'+zeroLead(dateTime.getMinutes());
    let dateCompare = dateTime.getDate()
                      +'/'+(dateTime.getMonth() + 1)
                      +'/'+dateTime.getFullYear();
    let now = new Date();
    let dateNow = now.getDate()
                  +'/'+(now.getMonth() + 1)
                  +'/'+now.getFullYear();
    if (dateCompare === dateNow) {
      return zeroLead(dateTime.getHours())+':'+zeroLead(dateTime.getMinutes());
    }
    return dateFormat;
  };
});

app.filter('dateLineChatBox', function(){
  return function(date, index, listMessage) {
    let d = new Date(date);
    let dateFormat = zeroLead(d.getDate())
                +'/'+zeroLead(d.getMonth() + 1)
                +'/'+d.getFullYear();
    if (index === 0) {
      return dateFormat;
    }
    let dateOld = new Date(listMessage[index - 1].created_at);
    let dateFormatOld = zeroLead(dateOld.getDate())
                +'/'+zeroLead(dateOld.getMonth() + 1)
                +'/'+dateOld.getFullYear();
    if (dateFormat !== dateFormatOld) {
      return dateFormat;
    }
    return '';
  }
});

app.filter('formatDateTime', function(){
  return function(date) {
    let d = new Date(date);
    let dateFormat = zeroLead(d.getDate())
                +'/'+zeroLead(d.getMonth() + 1)
                +'/'+d.getFullYear()
                +' '+zeroLead(d.getHours())
                +':'+zeroLead(d.getMinutes());
    return dateFormat;
  }
});

app.filter('formatDateTime', function(){
  return function(date) {
    let d = new Date(date);
    let dateFormat = zeroLead(d.getDate())
                +'/'+zeroLead(d.getMonth() + 1)
                +'/'+d.getFullYear()
                +' '+zeroLead(d.getHours())
                +':'+zeroLead(d.getMinutes());
    return dateFormat;
  }
});

function zeroLead(number) {
  return (number < 10 ? '0' : '') + number;
}

app.filter('roleText', function(){
  return function(typeNumber) {
    switch (typeNumber) {
      case 1:
        return 'Admin';
        break;
      case 2:
        return 'Editor';
        break;
      case 3:
        return 'Normal';
        break;
    
      default:
        return 'None'
        break;
    }
  }
});