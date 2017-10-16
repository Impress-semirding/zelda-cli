
export function createSliderRange (o) {
  const {min, max} = o;
  return {
    "key": o.key,
    "name": o.name,
    "uiType": "group",
    "valueType": "group",
    "children": [{
      "key": "min",
      "value": min[0],
      "name": "最小值",
      "uiType": "slider",
      "valueType": "int",
      "validate": {
        "range": {
          min: min[1],
          max: min[2]
        }
      }
    }, {
      "key": "max",
      "value": max[0],
      "name": "最大值",
      "uiType": "slider",
      "valueType": "int",
      "validate": {
        "range": {
          min: max[1],
          max: max[2]
        }
      }
    }]
  };
};
