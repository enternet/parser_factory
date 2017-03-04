function url2document(url) {
  var href = getLocation(url);
  var scheme_n_authority = href.protocol + href.host;
  var referer = scheme_n_authority + "/";
  var params = {
    "muteHttpExceptions": true,
    "followRedirects": true,
    "validateHttpsCertificates": false,
    "headers": {
      "Accept": "text/html,application/xhtml+xml,*/*",
      "Accept-Language": "ru",
      "Origin": scheme_n_authority,
      "Referer": referer,
      "User-Agent": "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko",
    }
  };
  
  var page = UrlFetchApp.fetch(url, params);
  var doc = Xml.parse(page, true);
  var bodyHtml = doc.html.body.toXmlString();
  //Logger.log(bodyHtml);
  doc = XmlService.parse(bodyHtml);
  return doc;
}

// http://stackoverflow.com/questions/6168260/how-to-parse-a-url
function getLocation(href) {
  var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
  return match && {
    protocol: match[1],
    host: match[2],
    hostname: match[3],
    port: match[4],
    pathname: match[5],
    search: match[6],
    hash: match[7]
  }
}

function test_location() {
  Logger.log(getLocation('javascript:void(0)'));
  Logger.log(getLocation('javascript:void(0)'));
}

//
// https://sites.google.com/site/scriptsexamples/learn-by-example/parsing-html
//

function getElementById(element, idToFind) {  
  var descendants = element.getDescendants();  
  for (i in descendants) {
    var elt = descendants[i].asElement();
    if (elt != null) {
      var id = elt.getAttribute('id');
      if (id != null && id.getValue() == idToFind) 
        return elt;    
    }
  }
}

function getElementsByClassName(element, classToFind) {  
  var data = [];
  var descendants = element.getDescendants();
  descendants.push(element);  
  for (i in descendants) {
    var elt = descendants[i].asElement();
    if (elt != null) {
      var classes = elt.getAttribute('class');
      if (classes != null) {
        classes = classes.getValue();
        if (classes == classToFind) 
          data.push(elt);
        else {
          classes = classes.split(' ');
          for (j in classes) {
            if (classes[j] == classToFind) {
              data.push(elt);
              break;
            }
          }
        }
      }
    }
  }
  return data;
}

function getElementsByTagName(element, tagName) {  
  var data = [];
  var descendants = element.getDescendants();  
  for (i in descendants) {
    var elt = descendants[i].asElement();     
    if (elt != null && elt.getName() == tagName) 
      data.push(elt);      
  }
  return data;
}

//
//
//

function pseudoXpath(element, xpath) {
  // Replacing tbody tag because app script doesnt understand.
  //xpath = xpath.replace("/html/","").replace("/tbody","","g");
  var tags = xpath.split("/");
  Logger.log("tags : " + tags);
  // getting the DOM of HTML
  
  for (var i in tags) {
    var tag = tags[i];
    Logger.log("Tag : " + tag);
    var index = tag.indexOf("[");
    if (index != -1) {
      var val = parseInt(tag.substring(index + 1, tag.indexOf("]")));
      tag = tag.substring(0, index);
      element = element.getElements(tag)[val - 1];
    } else {
      element = element.getElement(tag);
    }
    //Logger.log(element.toXmlString());
  }
  return element.getText();
}