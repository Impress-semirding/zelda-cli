/**
 * @Author: mark
 * @Date:   2017-04-21T09:52:10+08:00
 * @Email:  mark_z1988@icloud.com
 * @Filename: option.js
 * @Last modified by:   mark
 * @Last modified time: 2017-08-02T14:20:19+08:00
 * @License: MIT
 */

module.exports = {
  title: {
    show: true,
    text: '图',
    color: '#000000',
    left: '20px',
    textAlign: 'left',
  },
  /**
     * chart width with %
     * input: number
     */
  width: 100,
  /**
     * chart height with %
     * input: number
     */
  height: 100,

  /**
     * enable multiselection
     * input: boolean
     */
  multiSelectionMode: false,

  labelColor: '#000',

  hoverLabelColor: '#000',

  /**
     * layout algorithms between 'random', 'forceAtlas2', 'fruchtermanReingold'
     * input: { name: 'random', value: 'random'} || 'random'
     */
  layout: 'random',
  /**
     * forceAtlas2 algorithms options
     * input: Object
     */
  forceAtlas2: {
    startAlgorithms: true,
    adjustSizes: false,
    barnesHutOptimize: false,
    barnesHutTheta: 0.5,
    edgeWeightInfluence: 0,
    gravity: 1,
    iterationsPerRender: 1,
    linLogMode: false,
    outboundAttractionDistribution: false,
    scalingRatio: 1,
    slowDown: 1,
    startingIterations: 1,
    strongGravityMode: false,
  },
  /**
     * fruchtermanReingold algorithms options
     * input: Object
     */
  fruchtermanReingold: {
    area: 2000,
    autoArea: true,
    gravity: 1,
    iterations: 200,
    speed: 0.1,
  },

  allEdgesColor: {
    /**
       * whether using custom edges color
       * input: boolean
       */
    customColor: false,
    /**
       * edges color
       * input: hex || rgb
       */
    edgesColor: '#ccc',
  },
  /**
     * global edges size options
     * input: {}
     */
  allEdgesSize: {
    /**
       * whether using custom edges size
       * input: boolean
       */
    customSize: false,
    /**
       * edges size
       * input: {}
       */
    size: {
      edgesSize: 5,
    },
  },
  /**
     * global node color options
     * input: {}
     */

  showCommunityPolygon: false,
  allNodeColor: {
    /**
       * whether using custom node color
       * input: boolean
       */
    customColor: false,

    communityColor: {
      active: false,
      colorPool: {
        0: '#0091EA',
        1: '#A13FC3',
        2: '#98C2CF',
        3: '#6FB3F1',
        4: '#4CBFCF',
        5: '#61D6B1',
        6: '#A0E896',
        7: '#E7F59B',
        8: '#D3C24B',
        9: '#536572',
      },
    },
    /**
       * nodes color
       * input: {}
       */
    color: {
      globalColor: true,
      nodesColor: '#666666',
      gradientColor: {
        nodesLowColor: '#EEEEEE',
        nodesHighColor: '#0000FF',
        /**
           * algorithms between 'default', 'degree', 'closeness', 'betweennes', 'pagerank'
           * input: { name: 'default', value: 'default'} || 'default'
           */
        algorithms: 'default',
      },
    },
  },
  /**
     * global node size options
     * input: {}
     */
  allNodeSize: {
    /**
       * whether using custom node size
       * input: boolean
       */
    customSize: false,
    /**
       * nodes size
       * input: {}
       */
    size: {
      globalSize: true,
      nodesSize: 10,
      algorithms: 'default',
    },
  },

};
