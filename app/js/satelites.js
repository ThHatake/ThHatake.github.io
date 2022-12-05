function satelite(id, name, coordX, coordY, noradId, sensor, azimuth = 0, elevation = 0){
    this.id = id;
    this.name = name;
    this.coordX = coordX;
    this.coordY = coordY;
    this.noradId = noradId;
    this.sensor = sensor;
    this.azimuth = azimuth;
    this.elevation = elevation;
    
    this.print = () => {
        return `
        <div class="row mt-2 mb-2">
            <div class="col-lg-4 col-md-2 col-sm-2 col-xs-1">${this.id}</div>
            <div class="col-lg-7 col-md-9 col-sm-9 col-xs-9"><i class="fa-solid fa-satellite" style="color:black;"></i> ${this.name}</div>
            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-2"><a href="/satelite.html?sat=${this.id}" class="btn btn-info btn-xs">+info</a></div>
        </div>`;

    }
}
async function getSatelites(){
    const satelites = [];

    const data = await (await fetch("https://api.spectator.earth/satellite/")).json();
    data.features.forEach(x => {
        satelites.push(new satelite(
            x.id,
            x.properties.name,
            x.geometry ? x.geometry.coordinates[0].toFixed(4) : 'não disponível',
            x.geometry ? x.geometry.coordinates[1].toFixed(4) : 'não disponível',
            x.properties.norad_id,
            x.sensors ? x.sensors[0].type : 'não disponível'
        ))}
    );     
    return satelites
} 
async function getSatelite(id){
    const data = await (await fetch("https://api.spectator.earth/satellite/"+id)).json();

    const sat = new satelite(
        data.id,
        data.properties.name,
        data.geometry ? data.geometry.coordinates[0].toFixed(4) : 'não disponível',
        data.geometry ? data.geometry.coordinates[1].toFixed(4) : 'não disponível',
        data.properties.norad_id,
        data.sensors ? data.sensors[0].type : 'não disponível',
    );
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position)=>{
            if(sat.coordY != 'não disponível'){
                let posicao = position.coords;
                sat.azimuth = (posicao.latitude + sat.id).toFixed(4);
                sat.elevation = ((posicao.longitude + sat.id / 100)+90).toFixed(4);
                console.log(sat.azimuth)
            }
        });
    }else{
        alert('erro: não foi possível acessar a localização detalhada');
    }

    return sat;
}