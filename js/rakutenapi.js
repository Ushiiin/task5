//1．位置情報の取得に成功した時の処理
async function mapsInit(position) {
    //lat=緯度、lon=経度 を取得
    console.log(position, "成功！")
    // const lat = position.coords.latitude;
    // const lon = position.coords.longitude;
    nowLat = await position.coords.latitude;
    nowLon = await position.coords.longitude;
    $("#map").html("緯度"+nowLat+",  "+"経度"+nowLon);
};

//2． 位置情報の取得に失敗した場合の処理
function mapsError(error) {
    let e = "";
    if (error.code == 1) { //1＝位置情報取得が許可されてない（ブラウザの設定）
      e = "位置情報が許可されてません";
    }
    if (error.code == 2) { //2＝現在地を特定できない
      e = "現在位置を特定できません";
    }
    if (error.code == 3) { //3＝位置情報を取得する前にタイムアウトになった場合
      e = "位置情報を取得する前にタイムアウトになりました";
    }
    alert("エラー：" + e);
};
  
//3.位置情報取得オプション
const set ={
  enableHighAccuracy: true, //より高精度な位置を求める
  maximumAge: 20000,        //最後の現在地情報取得が20秒以内であればその情報を再利用する設定
  timeout: 10000            //10秒以内に現在地情報を取得できなければ、処理を終了
};

//Main:位置情報を取得する処理 //getCurrentPosition :or: watchPosition
var nowLat;
var nowLon;
navigator.geolocation.getCurrentPosition(mapsInit, mapsError, set);
var nowStr = nowLat + "," + nowLon;
console.log("NOW",nowStr,nowLat,nowLon);



$.getJSON(
	//読み込むJSONのURLを記述
    "https://app.rakuten.co.jp/services/api/Gora/GoraGolfCourseDetail/20170623?format=json&golfCourseId=140011&applicationId=1023959535379728369",
	function(data){
		console.dir(data.Item.address);
        console.log(data);
	}
);

async function callApi() {
    const res = await fetch("https://app.rakuten.co.jp/services/api/Gora/GoraGolfCourseDetail/20170623?format=json&golfCourseId=140011&applicationId=1023959535379728369");
    const json_data = await res.json();
    // console.log(res);
    // console.log(json_data);
    console.log(json_data.Item.golfCourseName);
    return json_data;
};
  
callApi();
var jusyo;

$("#kamapub").on("click", function() {
    var temp = callApi();
    var readAdress; 
    // Promiseの値へのアクセス方法がよくわからない。
    // 本当はAPIで返ってきた住所をcallRouteの関数に入れたいが、Async awaitだとPromiseになるし。
    // $.getJSONだと中のfunction(data)のdataを外へ出せない。
    temp.then((value) => {
        console.log("Nearpin",value.Item.nearPin);
        return value.Item.latitude + "," + value.Item.longitude;
    });
    console.log("temp",temp);
    // console.log("詠んだ場所",readAdress.resolve);
    $.getJSON(
        //読み込むJSONのURLを記述
        "https://app.rakuten.co.jp/services/api/Gora/GoraGolfCourseDetail/20170623?format=json&golfCourseId=140011&applicationId=1023959535379728369",
        function(data){
            jusyo = data.Item.address
            $("#kamapubAdress").html(jusyo);
            console.log(data.Item.latitude, data.Item.longitude);
            readAdress = data.Item.latitude + " " + data.Item.longitude;
            map.setMapType(Microsoft.Maps.MapTypeId.birdseye);
            // map.setView(Microsoft.Maps.zoom) = 20;
            map.setView({
                center: new Microsoft.Maps.Location(data.Item.latitude, data.Item.longitude),
                // zoom: 15
            });
        }
    );
    const gsHarajuku = "35.66935290199396,139.7029567922217"
    callRoute(gsHarajuku);
    // console.log("地図",map);
});


//Initialization processing
let map;
function GetMap() {
    map = new Microsoft.Maps.Map('#birds', {
        center: new Microsoft.Maps.Location(47.6149, -122.1941), //Location center position
        mapTypeId: Microsoft.Maps.MapTypeId.aerial,
        mapTypeId: Microsoft.Maps.MapTypeId.load, //aerial,canvasDark,canvasLight,birdseye,grayscale,streetside
        zoom: 15  //Zoom:1=zoomOut ~ 20=zoomUp
    });
    // 写真にする。
    map.setMapType(Microsoft.Maps.MapTypeId.aerial);
};

// ルートを地図上にプロットする。
// https://stackoverflow.com/questions/47748478/bing-maps-v8-uncaught-referenceerror-microsoft-is-not-defined

async function callRoute(inputAdress) {
    console.log("start")
    // サンフランシスコの座標は37.62,-122.38
    // サンノゼの座標は37.18,-121.52
    // const res = await fetch("http://dev.virtualearth.net/REST/v1/Routes?wp.0=Eiffel%20Tower&wp.1=52.37281823637122,4.8913778629197635&key=AivcJE2DVrmvB9enKj-Xy1jKbW2BmFeaEv0DNRN6xjSDoPLa32phCfXnmWooxaAG");
    // const res = await fetch("http://dev.virtualearth.net/REST/V1/Routes/Walking?wp.0=Eiffel%20Tower&wp.1=louvre%20museum&optmz=distance&output=json&key=AivcJE2DVrmvB9enKj-Xy1jKbW2BmFeaEv0DNRN6xjSDoPLa32phCfXnmWooxaAG");
    // const res = await fetch("http://dev.virtualearth.net/REST/v1/Routes?wp.0=35.59687035938982,139.66715717992093&wp.1=35.3353409,139.5735184&routeAttributes=routePath&tl=0.00001&key=AivcJE2DVrmvB9enKj-Xy1jKbW2BmFeaEv0DNRN6xjSDoPLa32phCfXnmWooxaAG");
    console.log("インプット",inputAdress);
    const kamaPub = "35.33876921254755,139.57029389792268";
    const requestAdress = "http://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=" + kamaPub + "&wp.1=" + inputAdress + "&optmz=distance&avoid=highways&routeAttributes=routePath&tl=0.00000344978,0.0000218840,0.000220577,0.00188803,0.0169860,0.0950130,0.846703&key=AivcJE2DVrmvB9enKj-Xy1jKbW2BmFeaEv0DNRN6xjSDoPLa32phCfXnmWooxaAG"
    const req = requestAdress;
    // const req = "http://dev.virtualearth.net/REST/V1/Routes/Driving?wp.0=44.979035,-93.26493&wp.1=44.943828508257866,-93.09332862496376&optmz=distance&avoid=highways&routeAttributes=routePath&tl=0.00000344978,0.0000218840,0.000220577,0.00188803,0.0169860,0.0950130,0.846703&key=AivcJE2DVrmvB9enKj-Xy1jKbW2BmFeaEv0DNRN6xjSDoPLa32phCfXnmWooxaAG"
    const res = await fetch(req);
    const route_data = await res.json();
    // console.log(res);
    console.log("route");
    console.log(route_data);
    let travelTimeSec = Number(route_data.resourceSets[0].resources[0].travelDuration);
    let jikan = Math.floor(travelTimeSec/3600) + "時間" + Math.ceil((travelTimeSec%3600)/60) + "分";
    $("#kamapubTime").html(jikan);
    const points_num = route_data.resourceSets[0].resources[0].routeLegs[0].itineraryItems.length;
    console.log(route_data.resourceSets[0].resources[0].routeLegs[0].itineraryItems);
    routeDetails = route_data.resourceSets[0].resources[0].routeLegs[0].itineraryItems;
    let coords = [];
    routeDetails.forEach(detail => {
        // console.log(detail.maneuverPoint.coordinates[0]);
        let zahyo = detail.maneuverPoint.coordinates;
        // console.log(zahyo[0],zahyo[1]);
        coords.push(new Microsoft.Maps.Location(zahyo[0],zahyo[1]));
        // var p = point.maneuverPoint.coordinates;
        // console.log(p);
    });
    console.log(coords);
    // create a polyline
    var line = new Microsoft.Maps.Polyline(coords, {
        strokeColor: 'red'
    });
    map.entities.push(line);
    return route_data;
};

callRoute();

// var coords = [];

// response.points.forEach(p => {
//     coords.push(new Microsoft.Maps.Location(p.latitude, p.longitude));
// });

// //Create a polyline
// var line = new Microsoft.Maps.Polyline(coords, {
//     strokeColor: 'red'
// });

//Add the polyline to map
// map.entities.push(line);

// $.getJSON(
//     "http://dev.virtualearth.net/REST/v1/Routes?wayPoint.1=35.3353409,139.5735184&waypoint.2=35.4353409,138.5735184&key=AivcJE2DVrmvB9enKj-Xy1jKbW2BmFeaEv0DNRN6xjSDoPLa32phCfXnmWooxaAG",
//     function(data){
//         console.dir("DATA",data);
//     }
// );


// document.getElementById("kamapub").onclick = function (){
//     map.setView({
//         mapTypeId: Microsoft.Maps.MapTypeId.aerial,
//         center: new Microsoft.Maps.Location(35.027222, -111.0225),
//         zoom: 15
// })
// };

// function loadMapScenario() {
//     console.log("PXX");
//     var map = new Microsoft.Maps.Map(document.getElementById('#birds'), {
//         /* No need to set credentials if already passed in URL */
//         center: new Microsoft.Maps.Location(41.878860, -87.635860),
//         mapTypeId: Microsoft.Maps.MapTypeId.birdseye
//     });
//     map.setView({ center: new Microsoft.Maps.Location(34.043048, -118.266875) });
// }


