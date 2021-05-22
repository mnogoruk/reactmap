import {Component} from "react/cjs/react.production.min";
import axios from 'axios';
import './components/main.css'
import MapPathContainer from "./components/map-path";

const interrail = require('interrail');

const GEO_URL = "http://127.0.0.1:8000/geo/"
const ROUTE_URL = "http://127.0.0.1:8000/routes/"


export default class MapContainer extends Component {

    async paths() {
        try {
            let cPath = await axios.get("http://127.0.0.1:8000/route/paths?city1=" + this.state.from + "&city2=" + this.state.to)
            return cPath.data
        } catch (ex) {
        }
    }

    async getCities(country) {
        try {
            let cities = await axios.get(GEO_URL + "cities/?country=" + country)
            return cities.data
        } catch (ex) {
        }
    }

    constructor(props) {
        super(props);
        this.calculate.bind(this)
        this.state = {
            stations: [],
            nodes: [],
            cPath: 0,
            fromCities: [],
            toCities: [],
            to: null,
            from: null
        }
    }

    componentDidMount() {
        this.getCities('Russia').then(cities=>{
            this.setState({fromCities: cities})
        })

        this.getCities('France').then(cities=>{
            this.setState({toCities: cities})
        })
    }

    listPaths() {
        if (this.state.cPath) {
            return this.state.cPath.paths;
        } else {
            return [];
        }
    }

    fromCities(){
        if (this.state.fromCities) {
            return this.state.fromCities;
        } else {
            return [];
        }
    }

    calculate(){
        this.paths().then(res => {
            this.setState({cPath: res})
        })
    }



    render() {
        return (
            <div>
                <div>
                    From:
                    <select name={"from-select"} id="from" value={this.state.from}  onChange={e=>this.setState({from: e.target.value})}>
                        {this.state.fromCities ? this.state.fromCities.map(city => {
                            return <option key={city.id} value={city.id}>{city.name}</option>
                        }) : <></>}

                    </select>
                    To:
                    <select name={"to-select"} id="to" value={this.state.to} onChange={e=>this.setState({to: e.target.value})}>
                        {this.state.toCities ? this.state.toCities.map(city => {
                            return <option key={city.id} value={city.id}>{city.name}</option>
                        }) : <></>}
                    </select>
                    <button onClick={() => this.calculate()}>Calculate</button>

                </div>

                <div className={'map-container'}>
                    {this.listPaths().map(path => {
                        return (<MapPathContainer
                            path={path}
                            source={this.state.cPath.source}
                            destination={this.state.cPath.destination}
                        />)
                    })}
                </div>
            </div>
        );
    }
}
