<template>
  <div ref="containerRef" class="graph-container"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { Graph } from '@antv/x6'

const containerRef = ref()

const commonAttrs = {
  body: {
    fill: '#fff',
    stroke: '#ff6700',
    strokeWidth: 1,
  },
  label: {
    refX: 0.5,
    refY: '100%',
    refY2: 1,
    textAnchor: 'middle',
    textVerticalAnchor: 'left',
  },
}

const nodeData = [
  {
    id: '1',
    label: '1111',
    x: 100,
    y: 100,
    img: 'https://via.placeholder.com/16',
    textAnchor: 'start',
  },
  {
    id: '2',
    label: '2222',
    x: 100,
    y: 150,
    img: 'https://via.placeholder.com/16',
    textAnchor: 'start',
  },
  {
    id: '3',
    label: '3333',
    x: 100,
    y: 200,
    img: 'https://via.placeholder.com/16',
    textAnchor: 'start',
  },
  {
    id: '4',
    label: '4444',
    x: 100,
    y: 250,
    img: 'https://via.placeholder.com/16',
    textAnchor: 'start',
  },
  {
    id: '5',
    label: '5555',
    x: 300,
    y: 100,
    img: 'https://via.placeholder.com/16',
    textAnchor: 'end',
  },
  {
    id: '6',
    label: '6666',
    x: 300,
    y: 150,
    img: 'https://via.placeholder.com/16',
    textAnchor: 'end',
  },
  {
    id: '7',
    label: '7777',
    x: 300,
    y: 200,
    img: 'https://via.placeholder.com/16',
    textAnchor: 'end',
  },
  {
    id: '8',
    label: '8888',
    x: 300,
    y: 250,
    img: 'https://via.placeholder.com/16',
    textAnchor: 'end',
  },
]

onMounted(() => {
  const graph = new Graph({
    container: containerRef.value,
    background: { color: '#f8f8f8' },
    grid: true,
    translating: false,
    interacting: { nodeMovable: false, edgeMovable: false },
    connecting: { allowBlank: false },
    panning: true,
    // mousewheel: true,
  })

  nodeData.forEach(({ id, label, textAnchor, x, y, img }) => {
    // 创建一个 div 节点
    graph.addNode({
      id,
      x,
      y,
      shape: 'ellipse',
      width: 40,
      height: 40,
      attrs: {
        body: {
          stroke: '#000',
          fill: '#fff',
          rx: 4,
          ry: 4,
        },
        // label: {
        //   text: label,
        //   fill: '#888',
        //   fontSize: 12,
        // },
        label: {
          text: label,
          refX: '100%',
          refX2: 4,
          refY: 0.5,
          textAnchor: textAnchor,
          textVerticalAnchor: 'middle',
        },
        // label: {
        //   text: label,
        //   fill: '#ff6700',
        //   fontSize: 12,
        //   fontWeight: 'bold',
        //   textAnchor: 'middle',
        //   textVerticalAnchor: 'middle',
        //   // refX: '-50%',
        //   refY: '50%',
        // },
        // image: {
        //   'xlink:href': img,
        //   width: 16,
        //   height: 16,
        //   refX: 8,
        //   refY: 12,
        // },
      },
    })
    // graph.addPort({
    //   group: 'a',
    //   id: `${label}`,
    //   attrs: { text: { text: label } },
    // })
  })

  // 连线
  const edgeData = [
    ['1', '5'],
    ['5', '6'],
    ['6', '7'],
    ['7', '8'],
    ['8', '4'],
    ['4', '3'],
    ['3', '2'],
    ['2', '1'],
  ]

  edgeData.forEach(([source, target]) => {
    graph.addEdge({
      source,
      target,
      attrs: {
        line: {
          sourceMarker: {
            tagName: 'path',
            d: '',
          },
          targetMarker: {
            tagName: 'path',
            d: '',
          },
          strokeWidth: 1,
        },
      },
    })
  })
})
</script>

<style scoped>
.graph-container {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
}
</style>
