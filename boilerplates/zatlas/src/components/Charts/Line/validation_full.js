/**
* @Author: eason
* @Date:   2017-05-25T16:29:07+08:00
* @Email:  uniquecolesmith@gmail.com
* @Last modified by:   eason
* @Last modified time: 2017-05-25T16:30:21+08:00
* @License: MIT
* @Copyright: Eason(uniquecolesmith@gmail.com)
*/

module.exports = [
  {
    "key": "backgroundColor",
    "value": "transparent",
    "valueType": "string",
    "name": "backgroundColor",
    "uiType": "input",
    "validate": {}
  }, {
    "key": "color",
    "valueType": "group",
    "name": "color",
    "uiType": "group",
    "children": [
      {
        "key": 0,
        "value": "#0091EA",
        "valueType": "color",
        "name": 0,
        "uiType": "color",
        "validate": {}
      }, {
        "key": 1,
        "value": "#A13FC3",
        "valueType": "color",
        "name": 1,
        "uiType": "color",
        "validate": {}
      }, {
        "key": 2,
        "value": "#98C2CF",
        "valueType": "color",
        "name": 2,
        "uiType": "color",
        "validate": {}
      }, {
        "key": 3,
        "value": "#6FB3F1",
        "valueType": "color",
        "name": 3,
        "uiType": "color",
        "validate": {}
      }, {
        "key": 4,
        "value": "#4CBFCF",
        "valueType": "color",
        "name": 4,
        "uiType": "color",
        "validate": {}
      }, {
        "key": 5,
        "value": "#61D6B1",
        "valueType": "color",
        "name": 5,
        "uiType": "color",
        "validate": {}
      }, {
        "key": 6,
        "value": "#A0E896",
        "valueType": "color",
        "name": 6,
        "uiType": "color",
        "validate": {}
      }, {
        "key": 7,
        "value": "#E7F59B",
        "valueType": "color",
        "name": 7,
        "uiType": "color",
        "validate": {}
      }, {
        "key": 8,
        "value": "#D3C24B",
        "valueType": "color",
        "name": 8,
        "uiType": "color",
        "validate": {}
      }, {
        "key": 9,
        "value": "#536572",
        "valueType": "color",
        "name": 9,
        "uiType": "color",
        "validate": {}
      }
    ]
  }, {
    "key": "legend",
    "valueType": "group",
    "name": "legend",
    "uiType": "group",
    "children": [
      {
        "key": "show",
        "value": true,
        "name": "show",
        "uiType": "toggle",
        "valueType": "boolean",
        "validate": {}
      }, {
        "key": "zlevel",
        "value": 0,
        "valueType": "integer",
        "name": "zlevel",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -2,
            "max": 2
          },
          "step": 1
        }
      }, {
        "key": "z",
        "value": 2,
        "valueType": "integer",
        "name": "z",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -1.5,
            "max": 10
          },
          "step": 1
        }
      }, {
        "key": "left",
        "value": "auto",
        "valueType": "string",
        "name": "left",
        "uiType": "input",
        "validate": {}
      }, {
        "key": "top",
        "value": "auto",
        "valueType": "string",
        "name": "top",
        "uiType": "input",
        "validate": {}
      }, {
        "key": "right",
        "value": "auto",
        "valueType": "string",
        "name": "right",
        "uiType": "input",
        "validate": {}
      }, {
        "key": "bottom",
        "value": "auto",
        "valueType": "string",
        "name": "bottom",
        "uiType": "input",
        "validate": {}
      }, {
        "key": "width",
        "value": "auto",
        "valueType": "string",
        "name": "width",
        "uiType": "input",
        "validate": {}
      }, {
        "key": "height",
        "value": "auto",
        "valueType": "string",
        "name": "height",
        "uiType": "input",
        "validate": {}
      }, {
        "key": "orient",
        "value": "horizontal",
        "valueType": "string",
        "name": "orient",
        "uiType": "input",
        "validate": {}
      }, {
        "key": "align",
        "value": "auto",
        "valueType": "string",
        "name": "align",
        "uiType": "input",
        "validate": {}
      }, {
        "key": "padding",
        "value": 5,
        "valueType": "integer",
        "name": "padding",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -0.75,
            "max": 22
          },
          "step": 1
        }
      }, {
        "key": "itemGap",
        "value": 10,
        "valueType": "integer",
        "name": "itemGap",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": 0.5,
            "max": 42
          },
          "step": 1
        }
      }, {
        "key": "itemWidth",
        "value": 25,
        "valueType": "integer",
        "name": "itemWidth",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": 4.25,
            "max": 102
          },
          "step": 1
        }
      }, {
        "key": "itemHeight",
        "value": 14,
        "valueType": "integer",
        "name": "itemHeight",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": 1.5,
            "max": 58
          },
          "step": 1
        }
      }, {
        "key": "selectedMode",
        "value": true,
        "name": "selectedMode",
        "uiType": "toggle",
        "valueType": "boolean",
        "validate": {}
      }, {
        "key": "inactiveColor",
        "value": "#ccc",
        "valueType": "color",
        "name": "inactiveColor",
        "uiType": "color",
        "validate": {}
      }, {
        "key": "selected",
        "valueType": "group",
        "name": "selected",
        "uiType": "group",
        "children": []
      }, {
        "key": "textStyle",
        "valueType": "group",
        "name": "textStyle",
        "uiType": "group",
        "children": [
          {
            "key": "color",
            "value": "#333",
            "valueType": "color",
            "name": "color",
            "uiType": "color",
            "validate": {}
          }, {
            "key": "fontStyle",
            "value": "normal",
            "valueType": "string",
            "name": "fontStyle",
            "uiType": "input",
            "validate": {}
          }, {
            "key": "fontWeight",
            "value": "normal",
            "valueType": "string",
            "name": "fontWeight",
            "uiType": "input",
            "validate": {}
          }, {
            "key": "fontFamily",
            "value": "sans-serif",
            "valueType": "string",
            "name": "fontFamily",
            "uiType": "input",
            "validate": {}
          }, {
            "key": "fontSize",
            "value": 12,
            "valueType": "integer",
            "name": "fontSize",
            "uiType": "slider",
            "validate": {
              "range": {
                "min": 1,
                "max": 50
              },
              "step": 1
            }
          }
        ]
      }, {
        "key": "tooltip",
        "valueType": "group",
        "name": "tooltip",
        "uiType": "group",
        "children": [
          {
            "key": "show",
            "value": false,
            "name": "show",
            "uiType": "toggle",
            "valueType": "boolean",
            "validate": {}
          }
        ]
      }, {
        "key": "backgroundColor",
        "value": "transparent",
        "valueType": "string",
        "name": "backgroundColor",
        "uiType": "input",
        "validate": {}
      }, {
        "key": "borderColor",
        "value": "#ccc",
        "valueType": "color",
        "name": "borderColor",
        "uiType": "color",
        "validate": {}
      }, {
        "key": "borderWidth",
        "value": 0,
        "valueType": "integer",
        "name": "borderWidth",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -2,
            "max": 2
          },
          "step": 1
        }
      }, {
        "key": "shadowBlur",
        "value": 1,
        "valueType": "integer",
        "name": "shadowBlur",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -1.75,
            "max": 6
          },
          "step": 1
        }
      }, {
        "key": "shadowOffsetX",
        "value": 0,
        "valueType": "integer",
        "name": "shadowOffsetX",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -2,
            "max": 2
          },
          "step": 1
        }
      }, {
        "key": "shadowOffsetY",
        "value": 0,
        "valueType": "integer",
        "name": "shadowOffsetY",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -2,
            "max": 2
          },
          "step": 1
        }
      }, {
        "key": "data",
        "valueType": "group",
        "name": "data",
        "uiType": "group",
        "children": [
          {
            "key": "icon",
            "value": "circle",
            "valueType": "string",
            "name": "icon",
            "uiType": "input",
            "validate": {}
          }, {
            "key": "textStyle",
            "valueType": "group",
            "name": "textStyle",
            "uiType": "group",
            "children": []
          }
        ]
      }
    ]
  }, {
    "key": "grid",
    "valueType": "group",
    "name": "grid",
    "uiType": "group",
    "children": [
      {
        "key": "show",
        "value": false,
        "name": "show",
        "uiType": "toggle",
        "valueType": "boolean",
        "validate": {}
      }, {
        "key": "zlevel",
        "value": 0,
        "valueType": "integer",
        "name": "zlevel",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -2,
            "max": 2
          },
          "step": 1
        }
      }, {
        "key": "z",
        "value": 2,
        "valueType": "integer",
        "name": "z",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -1.5,
            "max": 10
          },
          "step": 1
        }
      }, {
        "key": "left",
        "value": "10%",
        "valueType": "string",
        "name": "left",
        "uiType": "input",
        "validate": {}
      }, {
        "key": "top",
        "value": 60,
        "valueType": "integer",
        "name": "top",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": 13,
            "max": 242
          },
          "step": 1
        }
      }, {
        "key": "right",
        "value": "10%",
        "valueType": "string",
        "name": "right",
        "uiType": "input",
        "validate": {}
      }, {
        "key": "bottom",
        "value": 60,
        "valueType": "integer",
        "name": "bottom",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": 13,
            "max": 242
          },
          "step": 1
        }
      }, {
        "key": "width",
        "value": "auto",
        "valueType": "string",
        "name": "width",
        "uiType": "input",
        "validate": {}
      }, {
        "key": "height",
        "value": "auto",
        "valueType": "string",
        "name": "height",
        "uiType": "input",
        "validate": {}
      }, {
        "key": "containLabel",
        "value": false,
        "name": "containLabel",
        "uiType": "toggle",
        "valueType": "boolean",
        "validate": {}
      }, {
        "key": "backgroundColor",
        "value": "transparent",
        "valueType": "string",
        "name": "backgroundColor",
        "uiType": "input",
        "validate": {}
      }, {
        "key": "borderColor",
        "value": "#ccc",
        "valueType": "color",
        "name": "borderColor",
        "uiType": "color",
        "validate": {}
      }, {
        "key": "borderWidth",
        "value": 1,
        "valueType": "integer",
        "name": "borderWidth",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -1.75,
            "max": 6
          },
          "step": 1
        }
      }, {
        "key": "shadowOffsetX",
        "value": 0,
        "valueType": "integer",
        "name": "shadowOffsetX",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -2,
            "max": 2
          },
          "step": 1
        }
      }, {
        "key": "shadowOffsetY",
        "value": 0,
        "valueType": "integer",
        "name": "shadowOffsetY",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -2,
            "max": 2
          },
          "step": 1
        }
      }, {
        "key": "tooltip",
        "valueType": "group",
        "name": "tooltip",
        "uiType": "group",
        "children": [
          {
            "key": "show",
            "value": true,
            "name": "show",
            "uiType": "toggle",
            "valueType": "boolean",
            "validate": {}
          }, {
            "key": "trigger",
            "value": "item",
            "valueType": "string",
            "name": "trigger",
            "uiType": "input",
            "validate": {}
          }, {
            "key": "axisPointer",
            "valueType": "group",
            "name": "axisPointer",
            "uiType": "group",
            "children": [
              {
                "key": "type",
                "value": "line",
                "valueType": "string",
                "name": "type",
                "uiType": "input",
                "validate": {}
              }, {
                "key": "axis",
                "value": "auto",
                "valueType": "string",
                "name": "axis",
                "uiType": "input",
                "validate": {}
              }, {
                "key": "label",
                "valueType": "group",
                "name": "label",
                "uiType": "group",
                "children": [
                  {
                    "key": "shadow",
                    "value": false,
                    "name": "shadow",
                    "uiType": "toggle",
                    "valueType": "boolean",
                    "validate": {}
                  }, {
                    "key": "precision",
                    "value": "auto",
                    "valueType": "string",
                    "name": "precision",
                    "uiType": "input",
                    "validate": {}
                  }, {
                    "key": "margin",
                    "value": 3,
                    "valueType": "integer",
                    "name": "margin",
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -1.25,
                        "max": 14
                      },
                      "step": 1
                    }
                  }, {
                    "key": "textStyle",
                    "valueType": "group",
                    "name": "textStyle",
                    "uiType": "group",
                    "children": [
                      {
                        "key": "color",
                        "value": "#fff",
                        "valueType": "color",
                        "name": "color",
                        "uiType": "color",
                        "validate": {}
                      }, {
                        "key": "fontStyle",
                        "value": "normal",
                        "valueType": "string",
                        "name": "fontStyle",
                        "uiType": "input",
                        "validate": {}
                      }, {
                        "key": "fontWeight",
                        "value": "normal",
                        "valueType": "string",
                        "name": "fontWeight",
                        "uiType": "input",
                        "validate": {}
                      }, {
                        "key": "fontFamily",
                        "value": "sans-serif",
                        "valueType": "string",
                        "name": "fontFamily",
                        "uiType": "input",
                        "validate": {}
                      }, {
                        "key": "fontSize",
                        "value": 12,
                        "valueType": "integer",
                        "name": "fontSize",
                        "uiType": "slider",
                        "validate": {
                          "range": {
                            "min": 1,
                            "max": 50
                          },
                          "step": 1
                        }
                      }
                    ]
                  }, {
                    "key": "padding",
                    "valueType": "group",
                    "name": "padding",
                    "uiType": "group",
                    "children": [
                      {
                        "key": 0,
                        "value": 5,
                        "valueType": "integer",
                        "name": 0,
                        "uiType": "slider",
                        "validate": {
                          "range": {
                            "min": -0.75,
                            "max": 22
                          },
                          "step": 1
                        }
                      }, {
                        "key": 1,
                        "value": 7,
                        "valueType": "integer",
                        "name": 1,
                        "uiType": "slider",
                        "validate": {
                          "range": {
                            "min": -0.25,
                            "max": 30
                          },
                          "step": 1
                        }
                      }, {
                        "key": 2,
                        "value": 5,
                        "valueType": "integer",
                        "name": 2,
                        "uiType": "slider",
                        "validate": {
                          "range": {
                            "min": -0.75,
                            "max": 22
                          },
                          "step": 1
                        }
                      }, {
                        "key": 3,
                        "value": 7,
                        "valueType": "integer",
                        "name": 3,
                        "uiType": "slider",
                        "validate": {
                          "range": {
                            "min": -0.25,
                            "max": 30
                          },
                          "step": 1
                        }
                      }
                    ]
                  }, {
                    "key": "backgroundColor",
                    "value": "auto",
                    "valueType": "string",
                    "name": "backgroundColor",
                    "uiType": "input",
                    "validate": {}
                  }, {
                    "key": "borderWidth",
                    "value": 0,
                    "valueType": "integer",
                    "name": "borderWidth",
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -2,
                        "max": 2
                      },
                      "step": 1
                    }
                  }, {
                    "key": "shadowBlur",
                    "value": 3,
                    "valueType": "integer",
                    "name": "shadowBlur",
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -1.25,
                        "max": 14
                      },
                      "step": 1
                    }
                  }, {
                    "key": "shadowColor",
                    "value": "#aaa",
                    "valueType": "color",
                    "name": "shadowColor",
                    "uiType": "color",
                    "validate": {}
                  }, {
                    "key": "shadowOffsetX",
                    "value": 0,
                    "valueType": "integer",
                    "name": "shadowOffsetX",
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -2,
                        "max": 2
                      },
                      "step": 1
                    }
                  }, {
                    "key": "shadowOffsetY",
                    "value": 0,
                    "valueType": "integer",
                    "name": "shadowOffsetY",
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -2,
                        "max": 2
                      },
                      "step": 1
                    }
                  }
                ]
              }, {
                "key": "lineStyle",
                "valueType": "group",
                "name": "lineStyle",
                "uiType": "group",
                "children": [
                  {
                    "key": "color",
                    "value": "#555",
                    "valueType": "color",
                    "name": "color",
                    "uiType": "color",
                    "validate": {}
                  }, {
                    "key": "width",
                    "value": 1,
                    "valueType": "integer",
                    "name": "width",
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -1.75,
                        "max": 6
                      },
                      "step": 1
                    }
                  }, {
                    "key": "type",
                    "value": "solid",
                    "valueType": "string",
                    "name": "type",
                    "uiType": "input",
                    "validate": {}
                  }, {
                    "key": "shadowOffsetX",
                    "value": 0,
                    "valueType": "integer",
                    "name": "shadowOffsetX",
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -2,
                        "max": 2
                      },
                      "step": 1
                    }
                  }, {
                    "key": "shadowOffsetY",
                    "value": 0,
                    "valueType": "integer",
                    "name": "shadowOffsetY",
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -2,
                        "max": 2
                      },
                      "step": 1
                    }
                  }
                ]
              }, {
                "key": "shadowStyle",
                "valueType": "group",
                "name": "shadowStyle",
                "uiType": "group",
                "children": [
                  {
                    "key": "color",
                    "value": "rgba(150, 150, 150, 0.3)",
                    "valueType": "color",
                    "name": "color",
                    "uiType": "color",
                    "validate": {}
                  }, {
                    "key": "shadowOffsetX",
                    "value": 0,
                    "valueType": "integer",
                    "name": "shadowOffsetX",
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -2,
                        "max": 2
                      },
                      "step": 1
                    }
                  }, {
                    "key": "shadowOffsetY",
                    "value": 0,
                    "valueType": "integer",
                    "name": "shadowOffsetY",
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -2,
                        "max": 2
                      },
                      "step": 1
                    }
                  }
                ]
              }, {
                "key": "crossStyle",
                "valueType": "group",
                "name": "crossStyle",
                "uiType": "group",
                "children": [
                  {
                    "key": "color",
                    "value": "#555",
                    "valueType": "color",
                    "name": "color",
                    "uiType": "color",
                    "validate": {}
                  }, {
                    "key": "width",
                    "value": 1,
                    "valueType": "integer",
                    "name": "width",
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -1.75,
                        "max": 6
                      },
                      "step": 1
                    }
                  }, {
                    "key": "type",
                    "value": "solid",
                    "valueType": "string",
                    "name": "type",
                    "uiType": "input",
                    "validate": {}
                  }, {
                    "key": "shadowOffsetX",
                    "value": 0,
                    "valueType": "integer",
                    "name": "shadowOffsetX",
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -2,
                        "max": 2
                      },
                      "step": 1
                    }
                  }, {
                    "key": "shadowOffsetY",
                    "value": 0,
                    "valueType": "integer",
                    "name": "shadowOffsetY",
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -2,
                        "max": 2
                      },
                      "step": 1
                    }
                  }
                ]
              }
            ]
          }, {
            "key": "backgroundColor",
            "value": "rgba(50, 50, 50, 0.7)",
            "valueType": "color",
            "name": "backgroundColor",
            "uiType": "color",
            "validate": {}
          }, {
            "key": "borderColor",
            "value": "#333",
            "valueType": "color",
            "name": "borderColor",
            "uiType": "color",
            "validate": {}
          }, {
            "key": "borderWidth",
            "value": 0,
            "valueType": "integer",
            "name": "borderWidth",
            "uiType": "slider",
            "validate": {
              "range": {
                "min": -2,
                "max": 2
              },
              "step": 1
            }
          }, {
            "key": "padding",
            "value": 5,
            "valueType": "integer",
            "name": "padding",
            "uiType": "slider",
            "validate": {
              "range": {
                "min": -0.75,
                "max": 22
              },
              "step": 1
            }
          }, {
            "key": "textStyle",
            "valueType": "group",
            "name": "textStyle",
            "uiType": "group",
            "children": [
              {
                "key": "color",
                "value": "#fff",
                "valueType": "color",
                "name": "color",
                "uiType": "color",
                "validate": {}
              }, {
                "key": "fontStyle",
                "value": "normal",
                "valueType": "string",
                "name": "fontStyle",
                "uiType": "input",
                "validate": {}
              }, {
                "key": "fontWeight",
                "value": "normal",
                "valueType": "string",
                "name": "fontWeight",
                "uiType": "input",
                "validate": {}
              }, {
                "key": "fontFamily",
                "value": "sans-serif",
                "valueType": "string",
                "name": "fontFamily",
                "uiType": "input",
                "validate": {}
              }, {
                "key": "fontSize",
                "value": 14,
                "valueType": "integer",
                "name": "fontSize",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": 1.5,
                    "max": 58
                  },
                  "step": 1
                }
              }
            ]
          }, {
            "key": "extraCssText",
            "value": "",
            "valueType": "string",
            "name": "extraCssText",
            "uiType": "input",
            "validate": {}
          }
        ]
      }
    ]
  }, {
    "key": "xAxis",
    "valueType": "group",
    "name": "xAxis",
    "uiType": "group",
    "children": [
      {
        "key": "show",
        "value": true,
        "name": "show",
        "uiType": "toggle",
        "valueType": "boolean",
        "validate": {}
      }, {
        "key": "gridIndex",
        "value": 0,
        "valueType": "integer",
        "name": "gridIndex",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -2,
            "max": 2
          },
          "step": 1
        }
      }, {
        "key": "offset",
        "value": 0,
        "valueType": "integer",
        "name": "offset",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -2,
            "max": 2
          },
          "step": 1
        }
      }, {
        "key": "type",
        "value": "category",
        "valueType": "string",
        "name": "type",
        "uiType": "input",
        "validate": {}
      }, {
        "key": "nameTextStyle",
        "valueType": "group",
        "name": "nameTextStyle",
        "uiType": "group",
        "children": [
          {
            "key": "fontStyle",
            "value": "normal",
            "valueType": "string",
            "name": "fontStyle",
            "uiType": "input",
            "validate": {}
          }, {
            "key": "fontWeight",
            "value": "normal",
            "valueType": "string",
            "name": "fontWeight",
            "uiType": "input",
            "validate": {}
          }, {
            "key": "fontFamily",
            "value": "sans-serif",
            "valueType": "string",
            "name": "fontFamily",
            "uiType": "input",
            "validate": {}
          }, {
            "key": "fontSize",
            "value": 12,
            "valueType": "integer",
            "name": "fontSize",
            "uiType": "slider",
            "validate": {
              "range": {
                "min": 1,
                "max": 50
              },
              "step": 1
            }
          }
        ]
      }, {
        "key": "nameGap",
        "value": 15,
        "valueType": "integer",
        "name": "nameGap",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": 1.75,
            "max": 62
          },
          "step": 1
        }
      }, {
        "key": "inverse",
        "value": false,
        "name": "inverse",
        "uiType": "toggle",
        "valueType": "boolean",
        "validate": {}
      }, {
        "key": "boundaryGap",
        "value": false,
        "name": "boundaryGap",
        "uiType": "toggle",
        "valueType": "boolean",
        "validate": {}
      }, {
        "key": "scale",
        "value": false,
        "name": "scale",
        "uiType": "toggle",
        "valueType": "boolean",
        "validate": {}
      }, {
        "key": "splitNum",
        "value": 5,
        "valueType": "integer",
        "name": "splitNum",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -0.75,
            "max": 22
          },
          "step": 1
        }
      }, {
        "key": "minInterval",
        "value": 0,
        "valueType": "integer",
        "name": "minInterval",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -2,
            "max": 2
          },
          "step": 1
        }
      }, {
        "key": "logBase",
        "value": 10,
        "valueType": "integer",
        "name": "logBase",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": 0.5,
            "max": 42
          },
          "step": 1
        }
      }, {
        "key": "silent",
        "value": false,
        "name": "silent",
        "uiType": "toggle",
        "valueType": "boolean",
        "validate": {}
      }, {
        "key": "triggerEvent",
        "value": false,
        "name": "triggerEvent",
        "uiType": "toggle",
        "valueType": "boolean",
        "validate": {}
      }, {
        "key": "axisLine",
        "valueType": "group",
        "name": "axisLine",
        "uiType": "group",
        "children": [
          {
            "key": "show",
            "value": true,
            "name": "show",
            "uiType": "toggle",
            "valueType": "boolean",
            "validate": {}
          }, {
            "key": "onZero",
            "value": true,
            "name": "onZero",
            "uiType": "toggle",
            "valueType": "boolean",
            "validate": {}
          }, {
            "key": "lineStyle",
            "valueType": "group",
            "name": "lineStyle",
            "uiType": "group",
            "children": [
              {
                "key": "color",
                "value": "#333",
                "valueType": "color",
                "name": "color",
                "uiType": "color",
                "validate": {}
              }, {
                "key": "width",
                "value": 1,
                "valueType": "integer",
                "name": "width",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -1.75,
                    "max": 6
                  },
                  "step": 1
                }
              }, {
                "key": "type",
                "value": "solid",
                "valueType": "string",
                "name": "type",
                "uiType": "input",
                "validate": {}
              }, {
                "key": "shadowOffsetX",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetX",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }, {
                "key": "shadowOffsetY",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetY",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }
            ]
          }
        ]
      }, {
        "key": "axisTick",
        "valueType": "group",
        "name": "axisTick",
        "uiType": "group",
        "children": []
      }, {
        "key": "axisLabel",
        "valueType": "group",
        "name": "axisLabel",
        "uiType": "group",
        "children": [
          {
            "key": "show",
            "value": true,
            "name": "show",
            "uiType": "toggle",
            "valueType": "boolean",
            "validate": {}
          }, {
            "key": "interval",
            "value": "auto",
            "valueType": "string",
            "name": "interval",
            "uiType": "input",
            "validate": {}
          }, {
            "key": "inside",
            "value": false,
            "name": "inside",
            "uiType": "toggle",
            "valueType": "boolean",
            "validate": {}
          }, {
            "key": "rotate",
            "value": 0,
            "valueType": "integer",
            "name": "rotate",
            "uiType": "slider",
            "validate": {
              "range": {
                "min": -2,
                "max": 2
              },
              "step": 1
            }
          }, {
            "key": "margin",
            "value": 8,
            "valueType": "integer",
            "name": "margin",
            "uiType": "slider",
            "validate": {
              "range": {
                "min": 0,
                "max": 34
              },
              "step": 1
            }
          }, {
            "key": "textStyle",
            "valueType": "group",
            "name": "textStyle",
            "uiType": "group",
            "children": [
              {
                "key": "fontSize",
                "value": 10,
                "valueType": "integer",
                "name": "fontSize",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": 0.5,
                    "max": 42
                  },
                  "step": 1
                }
              }, {
                "key": "color",
                "value": "#666666",
                "valueType": "color",
                "name": "color",
                "uiType": "color",
                "validate": {}
              }
            ]
          }
        ]
      }, {
        "key": "splitLine",
        "valueType": "group",
        "name": "splitLine",
        "uiType": "group",
        "children": [
          {
            "key": "show",
            "value": false,
            "name": "show",
            "uiType": "toggle",
            "valueType": "boolean",
            "validate": {}
          }, {
            "key": "interval",
            "value": "auto",
            "valueType": "string",
            "name": "interval",
            "uiType": "input",
            "validate": {}
          }, {
            "key": "lineStyle",
            "valueType": "group",
            "name": "lineStyle",
            "uiType": "group",
            "children": [
              {
                "key": "color",
                "value": "#333",
                "valueType": "color",
                "name": "color",
                "uiType": "color",
                "validate": {}
              }, {
                "key": "width",
                "value": 1,
                "valueType": "integer",
                "name": "width",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -1.75,
                    "max": 6
                  },
                  "step": 1
                }
              }, {
                "key": "type",
                "value": "solid",
                "valueType": "string",
                "name": "type",
                "uiType": "input",
                "validate": {}
              }, {
                "key": "shadowOffsetX",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetX",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }, {
                "key": "shadowOffsetY",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetY",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }
            ]
          }
        ]
      }, {
        "key": "splitArea",
        "valueType": "group",
        "name": "splitArea",
        "uiType": "group",
        "children": [
          {
            "key": "show",
            "value": false,
            "name": "show",
            "uiType": "toggle",
            "valueType": "boolean",
            "validate": {}
          }, {
            "key": "interval",
            "value": "auto",
            "valueType": "string",
            "name": "interval",
            "uiType": "input",
            "validate": {}
          }, {
            "key": "areaStyle",
            "valueType": "group",
            "name": "areaStyle",
            "uiType": "group",
            "children": [
              {
                "key": "color",
                "valueType": "group",
                "name": "color",
                "uiType": "group",
                "children": [
                  {
                    "key": 0,
                    "value": "rgba(250,250,250,0.3)",
                    "valueType": "color",
                    "name": 0,
                    "uiType": "color",
                    "validate": {}
                  }, {
                    "key": 1,
                    "value": "rgba(200,200,200,0.3)",
                    "valueType": "color",
                    "name": 1,
                    "uiType": "color",
                    "validate": {}
                  }
                ]
              }, {
                "key": "shadowOffsetX",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetX",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }, {
                "key": "shadowOffsetY",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetY",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }
            ]
          }
        ]
      }, {
        "key": "axisPointer",
        "valueType": "group",
        "name": "axisPointer",
        "uiType": "group",
        "children": [
          {
            "key": "show",
            "value": false,
            "name": "show",
            "uiType": "toggle",
            "valueType": "boolean",
            "validate": {}
          }, {
            "key": "type",
            "value": "line",
            "valueType": "string",
            "name": "type",
            "uiType": "input",
            "validate": {}
          }, {
            "key": "label",
            "valueType": "group",
            "name": "label",
            "uiType": "group",
            "children": [
              {
                "key": "shadow",
                "value": false,
                "name": "shadow",
                "uiType": "toggle",
                "valueType": "boolean",
                "validate": {}
              }, {
                "key": "precision",
                "value": "auto",
                "valueType": "string",
                "name": "precision",
                "uiType": "input",
                "validate": {}
              }, {
                "key": "margin",
                "value": 3,
                "valueType": "integer",
                "name": "margin",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -1.25,
                    "max": 14
                  },
                  "step": 1
                }
              }, {
                "key": "textStyle",
                "valueType": "group",
                "name": "textStyle",
                "uiType": "group",
                "children": [
                  {
                    "key": "color",
                    "value": "#fff",
                    "valueType": "color",
                    "name": "color",
                    "uiType": "color",
                    "validate": {}
                  }, {
                    "key": "fontStyle",
                    "value": "normal",
                    "valueType": "string",
                    "name": "fontStyle",
                    "uiType": "input",
                    "validate": {}
                  }, {
                    "key": "fontWeight",
                    "value": "normal",
                    "valueType": "string",
                    "name": "fontWeight",
                    "uiType": "input",
                    "validate": {}
                  }, {
                    "key": "fontFamily",
                    "value": "sans-serif",
                    "valueType": "string",
                    "name": "fontFamily",
                    "uiType": "input",
                    "validate": {}
                  }, {
                    "key": "fontSize",
                    "value": 12,
                    "valueType": "integer",
                    "name": "fontSize",
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": 1,
                        "max": 50
                      },
                      "step": 1
                    }
                  }
                ]
              }, {
                "key": "padding",
                "valueType": "group",
                "name": "padding",
                "uiType": "group",
                "children": [
                  {
                    "key": 0,
                    "value": 5,
                    "valueType": "integer",
                    "name": 0,
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -0.75,
                        "max": 22
                      },
                      "step": 1
                    }
                  }, {
                    "key": 1,
                    "value": 7,
                    "valueType": "integer",
                    "name": 1,
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -0.25,
                        "max": 30
                      },
                      "step": 1
                    }
                  }, {
                    "key": 2,
                    "value": 5,
                    "valueType": "integer",
                    "name": 2,
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -0.75,
                        "max": 22
                      },
                      "step": 1
                    }
                  }, {
                    "key": 3,
                    "value": 7,
                    "valueType": "integer",
                    "name": 3,
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -0.25,
                        "max": 30
                      },
                      "step": 1
                    }
                  }
                ]
              }, {
                "key": "backgroundColor",
                "value": "auto",
                "valueType": "string",
                "name": "backgroundColor",
                "uiType": "input",
                "validate": {}
              }, {
                "key": "borderWidth",
                "value": 0,
                "valueType": "integer",
                "name": "borderWidth",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }, {
                "key": "shadowBlur",
                "value": 3,
                "valueType": "integer",
                "name": "shadowBlur",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -1.25,
                    "max": 14
                  },
                  "step": 1
                }
              }, {
                "key": "shadowColor",
                "value": "#aaa",
                "valueType": "color",
                "name": "shadowColor",
                "uiType": "color",
                "validate": {}
              }, {
                "key": "shadowOffsetX",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetX",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }, {
                "key": "shadowOffsetY",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetY",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }
            ]
          }, {
            "key": "lineStyle",
            "valueType": "group",
            "name": "lineStyle",
            "uiType": "group",
            "children": [
              {
                "key": "color",
                "value": "#555",
                "valueType": "color",
                "name": "color",
                "uiType": "color",
                "validate": {}
              }, {
                "key": "width",
                "value": 1,
                "valueType": "integer",
                "name": "width",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -1.75,
                    "max": 6
                  },
                  "step": 1
                }
              }, {
                "key": "type",
                "value": "solid",
                "valueType": "string",
                "name": "type",
                "uiType": "input",
                "validate": {}
              }, {
                "key": "shadowOffsetX",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetX",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }, {
                "key": "shadowOffsetY",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetY",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }
            ]
          }, {
            "key": "shadowStyle",
            "valueType": "group",
            "name": "shadowStyle",
            "uiType": "group",
            "children": [
              {
                "key": "color",
                "value": "rgba(150, 150, 150, 0.3)",
                "valueType": "color",
                "name": "color",
                "uiType": "color",
                "validate": {}
              }, {
                "key": "shadowOffsetX",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetX",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }, {
                "key": "shadowOffsetY",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetY",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }
            ]
          }, {
            "key": "triggerTooltip",
            "value": true,
            "name": "triggerTooltip",
            "uiType": "toggle",
            "valueType": "boolean",
            "validate": {}
          }
        ]
      }, {
        "key": "zlevel",
        "value": 0,
        "valueType": "integer",
        "name": "zlevel",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -2,
            "max": 2
          },
          "step": 1
        }
      }, {
        "key": "z",
        "value": 0,
        "valueType": "integer",
        "name": "z",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -2,
            "max": 2
          },
          "step": 1
        }
      }
    ]
  }, {
    "key": "yAxis",
    "valueType": "group",
    "name": "yAxis",
    "uiType": "group",
    "children": [
      {
        "key": "show",
        "value": true,
        "name": "show",
        "uiType": "toggle",
        "valueType": "boolean",
        "validate": {}
      }, {
        "key": "gridIndex",
        "value": 0,
        "valueType": "integer",
        "name": "gridIndex",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -2,
            "max": 2
          },
          "step": 1
        }
      }, {
        "key": "offset",
        "value": 0,
        "valueType": "integer",
        "name": "offset",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -2,
            "max": 2
          },
          "step": 1
        }
      }, {
        "key": "type",
        "value": "value",
        "valueType": "string",
        "name": "type",
        "uiType": "input",
        "validate": {}
      }, {
        "key": "nameTextStyle",
        "valueType": "group",
        "name": "nameTextStyle",
        "uiType": "group",
        "children": [
          {
            "key": "fontStyle",
            "value": "normal",
            "valueType": "string",
            "name": "fontStyle",
            "uiType": "input",
            "validate": {}
          }, {
            "key": "fontWeight",
            "value": "normal",
            "valueType": "string",
            "name": "fontWeight",
            "uiType": "input",
            "validate": {}
          }, {
            "key": "fontFamily",
            "value": "sans-serif",
            "valueType": "string",
            "name": "fontFamily",
            "uiType": "input",
            "validate": {}
          }, {
            "key": "fontSize",
            "value": 12,
            "valueType": "integer",
            "name": "fontSize",
            "uiType": "slider",
            "validate": {
              "range": {
                "min": 1,
                "max": 50
              },
              "step": 1
            }
          }
        ]
      }, {
        "key": "nameGap",
        "value": 15,
        "valueType": "integer",
        "name": "nameGap",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": 1.75,
            "max": 62
          },
          "step": 1
        }
      }, {
        "key": "inverse",
        "value": false,
        "name": "inverse",
        "uiType": "toggle",
        "valueType": "boolean",
        "validate": {}
      }, {
        "key": "boundaryGap",
        "value": true,
        "name": "boundaryGap",
        "uiType": "toggle",
        "valueType": "boolean",
        "validate": {}
      }, {
        "key": "scale",
        "value": false,
        "name": "scale",
        "uiType": "toggle",
        "valueType": "boolean",
        "validate": {}
      }, {
        "key": "splitNum",
        "value": 5,
        "valueType": "integer",
        "name": "splitNum",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -0.75,
            "max": 22
          },
          "step": 1
        }
      }, {
        "key": "minInterval",
        "value": 0,
        "valueType": "integer",
        "name": "minInterval",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": -2,
            "max": 2
          },
          "step": 1
        }
      }, {
        "key": "logBase",
        "value": 10,
        "valueType": "integer",
        "name": "logBase",
        "uiType": "slider",
        "validate": {
          "range": {
            "min": 0.5,
            "max": 42
          },
          "step": 1
        }
      }, {
        "key": "silent",
        "value": false,
        "name": "silent",
        "uiType": "toggle",
        "valueType": "boolean",
        "validate": {}
      }, {
        "key": "triggerEvent",
        "value": false,
        "name": "triggerEvent",
        "uiType": "toggle",
        "valueType": "boolean",
        "validate": {}
      }, {
        "key": "axisLine",
        "valueType": "group",
        "name": "axisLine",
        "uiType": "group",
        "children": [
          {
            "key": "show",
            "value": true,
            "name": "show",
            "uiType": "toggle",
            "valueType": "boolean",
            "validate": {}
          }, {
            "key": "onZero",
            "value": true,
            "name": "onZero",
            "uiType": "toggle",
            "valueType": "boolean",
            "validate": {}
          }, {
            "key": "lineStyle",
            "valueType": "group",
            "name": "lineStyle",
            "uiType": "group",
            "children": [
              {
                "key": "color",
                "value": "#333",
                "valueType": "color",
                "name": "color",
                "uiType": "color",
                "validate": {}
              }, {
                "key": "width",
                "value": 1,
                "valueType": "integer",
                "name": "width",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -1.75,
                    "max": 6
                  },
                  "step": 1
                }
              }, {
                "key": "type",
                "value": "solid",
                "valueType": "string",
                "name": "type",
                "uiType": "input",
                "validate": {}
              }, {
                "key": "shadowOffsetX",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetX",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }, {
                "key": "shadowOffsetY",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetY",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }
            ]
          }
        ]
      }, {
        "key": "axisTick",
        "valueType": "group",
        "name": "axisTick",
        "uiType": "group",
        "children": []
      }, {
        "key": "axisLabel",
        "valueType": "group",
        "name": "axisLabel",
        "uiType": "group",
        "children": [
          {
            "key": "show",
            "value": true,
            "name": "show",
            "uiType": "toggle",
            "valueType": "boolean",
            "validate": {}
          }, {
            "key": "interval",
            "value": "auto",
            "valueType": "string",
            "name": "interval",
            "uiType": "input",
            "validate": {}
          }, {
            "key": "inside",
            "value": false,
            "name": "inside",
            "uiType": "toggle",
            "valueType": "boolean",
            "validate": {}
          }, {
            "key": "rotate",
            "value": 0,
            "valueType": "integer",
            "name": "rotate",
            "uiType": "slider",
            "validate": {
              "range": {
                "min": -2,
                "max": 2
              },
              "step": 1
            }
          }, {
            "key": "margin",
            "value": 8,
            "valueType": "integer",
            "name": "margin",
            "uiType": "slider",
            "validate": {
              "range": {
                "min": 0,
                "max": 34
              },
              "step": 1
            }
          }, {
            "key": "textStyle",
            "valueType": "group",
            "name": "textStyle",
            "uiType": "group",
            "children": [
              {
                "key": "fontSize",
                "value": 10,
                "valueType": "integer",
                "name": "fontSize",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": 0.5,
                    "max": 42
                  },
                  "step": 1
                }
              }, {
                "key": "color",
                "value": "#666666",
                "valueType": "color",
                "name": "color",
                "uiType": "color",
                "validate": {}
              }
            ]
          }
        ]
      }, {
        "key": "splitLine",
        "valueType": "group",
        "name": "splitLine",
        "uiType": "group",
        "children": [
          {
            "key": "show",
            "value": false,
            "name": "show",
            "uiType": "toggle",
            "valueType": "boolean",
            "validate": {}
          }, {
            "key": "interval",
            "value": "auto",
            "valueType": "string",
            "name": "interval",
            "uiType": "input",
            "validate": {}
          }, {
            "key": "lineStyle",
            "valueType": "group",
            "name": "lineStyle",
            "uiType": "group",
            "children": [
              {
                "key": "color",
                "value": "#333",
                "valueType": "color",
                "name": "color",
                "uiType": "color",
                "validate": {}
              }, {
                "key": "width",
                "value": 1,
                "valueType": "integer",
                "name": "width",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -1.75,
                    "max": 6
                  },
                  "step": 1
                }
              }, {
                "key": "type",
                "value": "solid",
                "valueType": "string",
                "name": "type",
                "uiType": "input",
                "validate": {}
              }, {
                "key": "shadowOffsetX",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetX",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }, {
                "key": "shadowOffsetY",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetY",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }
            ]
          }
        ]
      }, {
        "key": "splitArea",
        "valueType": "group",
        "name": "splitArea",
        "uiType": "group",
        "children": [
          {
            "key": "show",
            "value": false,
            "name": "show",
            "uiType": "toggle",
            "valueType": "boolean",
            "validate": {}
          }, {
            "key": "interval",
            "value": "auto",
            "valueType": "string",
            "name": "interval",
            "uiType": "input",
            "validate": {}
          }, {
            "key": "areaStyle",
            "valueType": "group",
            "name": "areaStyle",
            "uiType": "group",
            "children": [
              {
                "key": "color",
                "valueType": "group",
                "name": "color",
                "uiType": "group",
                "children": [
                  {
                    "key": 0,
                    "value": "rgba(250,250,250,0.3)",
                    "valueType": "color",
                    "name": 0,
                    "uiType": "color",
                    "validate": {}
                  }, {
                    "key": 1,
                    "value": "rgba(200,200,200,0.3)",
                    "valueType": "color",
                    "name": 1,
                    "uiType": "color",
                    "validate": {}
                  }
                ]
              }, {
                "key": "shadowOffsetX",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetX",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }, {
                "key": "shadowOffsetY",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetY",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }
            ]
          }
        ]
      }, {
        "key": "axisPointer",
        "valueType": "group",
        "name": "axisPointer",
        "uiType": "group",
        "children": [
          {
            "key": "show",
            "value": false,
            "name": "show",
            "uiType": "toggle",
            "valueType": "boolean",
            "validate": {}
          }, {
            "key": "type",
            "value": "line",
            "valueType": "string",
            "name": "type",
            "uiType": "input",
            "validate": {}
          }, {
            "key": "label",
            "valueType": "group",
            "name": "label",
            "uiType": "group",
            "children": [
              {
                "key": "shadow",
                "value": false,
                "name": "shadow",
                "uiType": "toggle",
                "valueType": "boolean",
                "validate": {}
              }, {
                "key": "precision",
                "value": "auto",
                "valueType": "string",
                "name": "precision",
                "uiType": "input",
                "validate": {}
              }, {
                "key": "margin",
                "value": 3,
                "valueType": "integer",
                "name": "margin",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -1.25,
                    "max": 14
                  },
                  "step": 1
                }
              }, {
                "key": "textStyle",
                "valueType": "group",
                "name": "textStyle",
                "uiType": "group",
                "children": [
                  {
                    "key": "color",
                    "value": "#fff",
                    "valueType": "color",
                    "name": "color",
                    "uiType": "color",
                    "validate": {}
                  }, {
                    "key": "fontStyle",
                    "value": "normal",
                    "valueType": "string",
                    "name": "fontStyle",
                    "uiType": "input",
                    "validate": {}
                  }, {
                    "key": "fontWeight",
                    "value": "normal",
                    "valueType": "string",
                    "name": "fontWeight",
                    "uiType": "input",
                    "validate": {}
                  }, {
                    "key": "fontFamily",
                    "value": "sans-serif",
                    "valueType": "string",
                    "name": "fontFamily",
                    "uiType": "input",
                    "validate": {}
                  }, {
                    "key": "fontSize",
                    "value": 12,
                    "valueType": "integer",
                    "name": "fontSize",
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": 1,
                        "max": 50
                      },
                      "step": 1
                    }
                  }
                ]
              }, {
                "key": "padding",
                "valueType": "group",
                "name": "padding",
                "uiType": "group",
                "children": [
                  {
                    "key": 0,
                    "value": 5,
                    "valueType": "integer",
                    "name": 0,
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -0.75,
                        "max": 22
                      },
                      "step": 1
                    }
                  }, {
                    "key": 1,
                    "value": 7,
                    "valueType": "integer",
                    "name": 1,
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -0.25,
                        "max": 30
                      },
                      "step": 1
                    }
                  }, {
                    "key": 2,
                    "value": 5,
                    "valueType": "integer",
                    "name": 2,
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -0.75,
                        "max": 22
                      },
                      "step": 1
                    }
                  }, {
                    "key": 3,
                    "value": 7,
                    "valueType": "integer",
                    "name": 3,
                    "uiType": "slider",
                    "validate": {
                      "range": {
                        "min": -0.25,
                        "max": 30
                      },
                      "step": 1
                    }
                  }
                ]
              }, {
                "key": "backgroundColor",
                "value": "auto",
                "valueType": "string",
                "name": "backgroundColor",
                "uiType": "input",
                "validate": {}
              }, {
                "key": "borderWidth",
                "value": 0,
                "valueType": "integer",
                "name": "borderWidth",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }, {
                "key": "shadowBlur",
                "value": 3,
                "valueType": "integer",
                "name": "shadowBlur",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -1.25,
                    "max": 14
                  },
                  "step": 1
                }
              }, {
                "key": "shadowColor",
                "value": "#aaa",
                "valueType": "color",
                "name": "shadowColor",
                "uiType": "color",
                "validate": {}
              }, {
                "key": "shadowOffsetX",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetX",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }, {
                "key": "shadowOffsetY",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetY",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }
            ]
          }, {
            "key": "lineStyle",
            "valueType": "group",
            "name": "lineStyle",
            "uiType": "group",
            "children": [
              {
                "key": "color",
                "value": "#555",
                "valueType": "color",
                "name": "color",
                "uiType": "color",
                "validate": {}
              }, {
                "key": "width",
                "value": 1,
                "valueType": "integer",
                "name": "width",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -1.75,
                    "max": 6
                  },
                  "step": 1
                }
              }, {
                "key": "type",
                "value": "solid",
                "valueType": "string",
                "name": "type",
                "uiType": "input",
                "validate": {}
              }, {
                "key": "shadowOffsetX",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetX",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }, {
                "key": "shadowOffsetY",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetY",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }
            ]
          }, {
            "key": "shadowStyle",
            "valueType": "group",
            "name": "shadowStyle",
            "uiType": "group",
            "children": [
              {
                "key": "color",
                "value": "rgba(150, 150, 150, 0.3)",
                "valueType": "color",
                "name": "color",
                "uiType": "color",
                "validate": {}
              }, {
                "key": "shadowOffsetX",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetX",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }, {
                "key": "shadowOffsetY",
                "value": 0,
                "valueType": "integer",
                "name": "shadowOffsetY",
                "uiType": "slider",
                "validate": {
                  "range": {
                    "min": -2,
                    "max": 2
                  },
                  "step": 1
                }
              }
            ]
          }
        ]
      }
    ]
  }, {
    "key": "tooltip",
    "valueType": "group",
    "name": "tooltip",
    "uiType": "group",
    "children": [
      {
        "key": "trigger",
        "value": "axis",
        "valueType": "string",
        "name": "trigger",
        "uiType": "input",
        "validate": {}
      }, {
        "key": "backgroundColor",
        "value": "#fff",
        "valueType": "color",
        "name": "backgroundColor",
        "uiType": "color",
        "validate": {}
      }, {
        "key": "textStyle",
        "valueType": "group",
        "name": "textStyle",
        "uiType": "group",
        "children": [
          {
            "key": "fontSize",
            "value": 10,
            "valueType": "integer",
            "name": "fontSize",
            "uiType": "slider",
            "validate": {
              "range": {
                "min": 0.5,
                "max": 42
              },
              "step": 1
            }
          }, {
            "key": "color",
            "value": "#4A4A4A",
            "valueType": "color",
            "name": "color",
            "uiType": "color",
            "validate": {}
          }
        ]
      }, {
        "key": "axisPointer",
        "valueType": "group",
        "name": "axisPointer",
        "uiType": "group",
        "children": [
          {
            "key": "lineStyle",
            "valueType": "group",
            "name": "lineStyle",
            "uiType": "group",
            "children": [
              {
                "key": "color",
                "value": "#C9C9C9",
                "valueType": "color",
                "name": "color",
                "uiType": "color",
                "validate": {}
              }
            ]
          }
        ]
      }, {
        "key": "extraCssText",
        "value": "box-shadow: 0 2px 4px rgba(0,0,0,.5);",
        "valueType": "string",
        "name": "extraCssText",
        "uiType": "input",
        "validate": {}
      }
    ]
  }
]
