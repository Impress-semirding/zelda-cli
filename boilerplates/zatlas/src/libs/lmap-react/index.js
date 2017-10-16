
import Map from './components/Map';
import AreaScalable from './components/AreaScalable';
import ScatterCanvas from './components/ScatterCanvas';
import ScatterKonvaPlain from './components/ScatterKonvaPlain'
import ScatterKonva from './components/ScatterKonva';
import TileLayer from './components/TileLayer';
import HeatmapGrid from './components/HeatmapGrid';
import HeatmapGeohashGrid from './components/HeatmapGeohashGrid';
import Areas from './components/Areas';
import LinkKonva from './components/LinkKonva';
import Bound from './components/selectors/Bound';

const layers = {
	TileLayer,
	AreaScalable,
	Areas,
	ScatterCanvas,
	ScatterKonva,
	ScatterKonvaPlain,
	//
	HeatmapGeohashGrid,
	HeatmapGrid,
	//
	LinkKonva,
}

export default {
	Map,
	Bound,
	layers,
	...layers
};
