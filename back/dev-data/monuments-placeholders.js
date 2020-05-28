const NodeGeocoder = require('node-geocoder')
const userData = require('./users-placeholders')
const latlongs = `52°55′01″N,52.91707199,19°05′08″E,19.08560845,111.0407,357.941°
52°32′52″N,52.54786673,19°00′32″E,19.00875007,70.5164,352.485°
53°37′25″N,53.62367174,18°54′13″E,18.90366418,190.2544,355.197°
52°25′19″N,52.42200929,22°31′01″E,22.51692976,236.6854,75.012°
51°37′35″N,51.62640709,18°40′33″E,18.67577472,45.8842,224.931°
52°19′12″N,52.31997193,16°50′43″E,16.84525776,163.2554,286.742°
51°37′12″N,51.62003669,20°39′08″E,20.6520979,108.9368,107.204°
50°27′40″N,50.4612191,20°48′02″E,20.80054235,199.0415,143.92°
51°55′49″N,51.93033426,17°14′04″E,17.23453459,131.0526,271.284°
51°04′45″N,51.0792464,18°39′12″E,18.65339202,99.4555,200.211°
50°35′44″N,50.59556212,21°30′52″E,21.51440654,221.0688,130.83°
51°40′45″N,51.67918157,20°11′46″E,20.19609239,77.0705,109.87°
53°17′42″N,53.29508111,16°43′16″E,16.72097827,224.0806,314.019°
53°34′05″N,53.5680684,19°01′26″E,19.02375878,183.5571,357.497°
51°25′38″N,51.42718816,16°33′23″E,16.55645235,186.7481,253.972°
50°04′48″N,50.07994774,19°01′46″E,19.02939578,204.7556,182.312°
50°53′47″N,50.89633981,20°03′59″E,20.06641998,130.5131,150.314°
52°12′04″N,52.20100133,22°30′06″E,22.50173137,231.6508,80.908°
51°03′24″N,51.05678499,16°17′27″E,16.29093611,219.7074,245.231°
53°44′47″N,53.74637759,18°15′52″E,18.26435706,211.6464,344.112°`

const lls = latlongs
  .split('\n')
  .map(xs => xs.split(','))
  .map(y => ({lat: y[1], long: y[3]}))

const addresses = [
  'Bielica, Kuyavian-Pomeranian Voivodeship',
  'Szatki Duże, Kuyavian-Pomeranian Voivodeship',
  'Kalmuzy, Pomeranian Voivodeship',
  'Wasilew Skrzeszewski, Masovian Voivodeship',
  'Dzierlin, Łódź Voivodeship',
  'Wiry, Greater Poland Voivodeship',
  'Gostomia, Masovian Voivodeship',
  'Żerniki Górne, Świętokrzyskie Voivodeship',
  'Jeżewo, Greater Poland Voivodeship',
  'Grabowa, Łódź Voivodeship',
  'Beszyce Górne, Świętokrzyskie Voivodeship',
  'Lipie, Łódź Voivodeship',
  'Zabrodzie, Greater Poland Voivodeship',
  'Szembruk, Kuyavian-Pomeranian Voivodeship',
  'Słup, Lower Silesian Voivodeship',
  'Tychy, Silesian Voivodeship',
  'Chotów, Świętokrzyskie Voivodeship',
  'Kolonia Mordy, Masovian Voivodeship',
  'Mściwojów, Lower Silesian Voivodeship',
  'Zdrójno, Pomeranian Voivodeship',
]

const ids = [
  '5c88fa8cf4afda39709c2955',
  '5c88fa8cf4afda39709c2951',
  '5c88fa8cf4afda39709c295a',
  '5c88fa8cf4afda39709c2961',
  '5c88fa8cf4afda39709c295d',
  '5c88fa8cf4afda39709c2966',
  '5c88fa8cf4afda39709c2970',
  '5c88fa8cf4afda39709c2974',
  '5c88fa8cf4afda39709c296c',
  '5c88fa8cf4afda39709c296f',
]

function getMonuments(ratingsMap) {
  var monuments = []
  for (let i = 0; i < ids.length; i++) {
    console.log(ratingsMap.get(i))
    monuments.push({
      _id: ids[i],
      name: `Monument${i}`,
      category:
        Math.random() < 1 / 3
          ? 'statue'
          : Math.random() < 2 / 3
          ? 'graffiti'
          : 'painting',
      imageCover: `monument-${i}-cover.jpg`,
      images: [
        'monument-${i}-1.jpg',
        'monument-${i}-2.jpg',
        'monument-${i}-3.jpg',
        'monument-${i}-4.jpg',
      ],
      ratingsAverage: ratingsMap.get(i).sum / ratingsMap.get(i).n,
      ratingsQuantity: ratingsMap.get(i).n,
      description:
        'Case felt the edge of the previous century. The Tessier-Ashpool ice shattered, peeling away from the Chinese program’s thrust, a worrying impression of solid fluidity, as though the shards of a broken mirror bent and elongated as they rotated, but it never told the correct time. The semiotics of the spherical chamber. They were dropping, losing altitude in a canyon of rainbow foliage, a lurid communal mural that completely covered the hulls of the Villsa bespeak a turning in, a denial of the bright void beyond the hulls. Its hands were holograms that altered to match the convolutions of the spherical chamber.',
      location: {
        coordinates: [lls[i].lat, lls[i].long],
        address: addresses[i],
      },
    })
  }

  return monuments
}

module.exports = {
  ids,
  getMonuments,
}

// ****

const splitEvery = (n, xs, y = []) =>
  xs.length == 0 ? y : splitEvery(n, xs.slice(n), y.concat([xs.slice(0, n)]))

// var options = {
//   provider: 'mapquest',
//   httpAdapter: 'https', // Default
//   apiKey: 'QB7zNBnxOJ8tG4LZDfCvMn6Jenek8oCM', // for Mapquest, OpenCage, Google Premier
//   formatter: 'json', // 'gpx', 'string', ...
// }

// var geocoder = NodeGeocoder(options)

// const addresses = lls.map(ll => {
//   return geocoder.reverse({lat: ll.lat, lon: ll.long}, function (err, res) {
//     return res
//   })
// })

// Promise.all(addresses).then(res => {
//   console.log(res.flat().map(r => `${r.city}, ${r.stateCode}`))
//   //   createMonuments(res.map(r => r.formattedAddress))
//   //   console.log(monuments)
// })
