const axios = require('axios');
const Promise = require('bluebird');
const geolib = require('geolib');

Func();

//https://geocode.xyz/Minsk?json=1

async function Func() {
    // 1. Отправим параллельные запросы на информацию о городах - Минск, Мадрид, Рим. Из ответов выведем соответствия город - страна
    let cities = await Promise.all([
        axios.get(`https://geocode.xyz/Minsk?json=1`),
        axios.get(`https://geocode.xyz/Madrid?json=1`),
        axios.get(`https://geocode.xyz/Rome?json=1`)
    ]);
    cities.forEach((city) => {
        console.log(city.data.standard.countryname + ' - ' + city.data.standard.city);
    });

    // 2. С помощью Promise.any получим страну этих городов - Париж, Ницца
    let country = await Promise.any([
        axios.get(`https://geocode.xyz/Paris?json=1`),
        axios.get(`https://geocode.xyz/Nice?json=1`)
    ]);
    console.log('Promise.any = ' + country.data.standard.countryname + ' - ' + country.data.standard.city);

    const value = await Promise.all(
        [
            axios.get(`https://geocode.xyz/Brest?json=1`),
            axios.get(`https://geocode.xyz/Minsk?json=1`)
        ])
    console.log("Расстояние между Брестом и Минском : " + geolib.getDistance({latitude: value[0].data.latt, longitude: value[0].data.longt}, {latitude: value[1].data.latt, longitude: value[1].data.longt}));

    let coord1 = [];
    Promise.mapSeries([
        axios.get(`https://geocode.xyz/Minsk?json=1`),
        axios.get(`https://geocode.xyz/Copenhagen?json=1`),
        axios.get(`https://geocode.xyz/Oslo?json=1`),
        axios.get(`https://geocode.xyz/Brussel?json=1`)
    ], function(town){
        coord1.push({latitude: town.data.latt, longitude:town.data.longt});
        console.log(town.data.standard.city);
        console.log(town.data.latt +' '+town.data.longt);
    }).then(function(resolve, reject){
        console.log(geolib.findNearest(coord1[0], coord1, 1));
    });

}