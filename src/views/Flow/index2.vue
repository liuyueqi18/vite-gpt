<template>
  <div class="container">
    <div id="container_flow" style="height: 100%"></div>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import LogicFlow from '@logicflow/core'
import TaskNode from './TaskNode.js'
import TaskLine from './TaskLine.js'
import '@logicflow/core/lib/style/index.css'

const lf = ref()

const dataList = [
  [
    { id: '1', label: '1-TextTextTextText' },
    { id: '2', label: '2-TextTextTextTextTextTextTextText' },
    { id: '3', label: '3-TextTextTextText', pointId: '4-2', text: '边文字' },
    { id: '4', label: '4-TextTextTextText' },
    { id: '5', label: '5-TextTextTextTextTextTextTextTextTextTextTextTextTextTextTextText' },
    { id: '6', label: '6-TextTextTextTextTextTextTextTextTextTextTextText' },
    { id: '7', label: '7-TextTcvextTextTextTextTextTextTextTextTextTextText' },
  ],
  [
    { id: '4-1', label: '4-1 子节点' },
    { id: '4-2', label: '4-2 子节点' },
    { id: '4-3', label: '4-3 子节点' },
    { id: '4-4', label: '4-4 子节点' },
    { id: '4-5', label: '4-5 子节点' },
    { id: '4-6', label: '4-6 子节点', pointId: '6', text: '边文字' },
    { id: '4-7', label: '4-7 子节点' },
  ],
]

function findItemById(id, dataList) {
  for (const group of dataList) {
    for (const item of group) {
      if (item.id === id) {
        return item
      }
    }
  }
  return null // 没找到就返回 null
}

function generateLogicflowGraph(rawData, centerX = 0, centerY = 0) {
  const nodeWidth = 200
  const nodeHeight = 100
  const marginX = 60
  const marginY = 150

  //   const centerX = 0
  //   const centerY = 0

  const totalNodes = rawData.length
  const bottomCount = Math.min(2, totalNodes)

  const remaining = totalNodes - bottomCount
  const rightCount = Math.ceil(remaining / 2)
  const leftCount = remaining - rightCount

  const rightNodes = rawData.slice(0, rightCount)
  const bottomNodes = rawData.slice(rightCount, rightCount + bottomCount)
  const leftNodes = rawData.slice(rightCount + bottomCount)

  const nodes = []
  const sequence = []

  // 右侧：从上往下
  rightNodes.forEach((node, i) => {
    nodes.push({
      id: node.id,
      type: 'TaskNode',
      x: centerX + nodeWidth + marginX,
      y: centerY - (rightNodes.length / 2) * (nodeHeight + marginY) + i * (nodeHeight + marginY),
      properties: {
        nodeWidth,
        nodeHeight,
        nodeText: node.label,
        pointId: node.pointId ?? '',
        flexDirection: 'row-reverse',
        nodeDirection: 'right',
        image: 'https://fanyi-cdn.cdn.bcebos.com/static/cat/asset/jpg.9b515fbd.png',
      },
    })
    sequence.push(node.id)
  })

  // 底部：右 → 左
  bottomNodes.forEach((node, i) => {
    const totalWidth = bottomNodes.length * (nodeWidth + marginX) - marginX
    nodes.push({
      id: node.id,
      type: 'TaskNode',
      x: centerX + totalWidth / 2 - i * (nodeWidth + marginX) - 50,
      y:
        centerY +
        (Math.max(leftNodes.length, rightNodes.length) / 2 + 0.5) * (nodeHeight + marginY),
      properties: {
        nodeWidth: nodeWidth,
        nodeHeight: nodeHeight + 100,
        nodeText: node.label,
        pointId: node.pointId ?? '',
        flexDirection: 'column-reverse',
        nodeDirection: 'bottom',
        image: 'https://fanyi-cdn.cdn.bcebos.com/static/cat/asset/jpg.9b515fbd.png',
      },
    })
    sequence.push(node.id)
  })

  // 左侧：从下往上
  leftNodes.forEach((node, i) => {
    nodes.push({
      id: node.id,
      type: 'TaskNode',
      x: centerX - nodeWidth - marginX,
      y:
        leftNodes.length - 1 === i
          ? centerY - (rightNodes.length / 2) * (nodeHeight + marginY)
          : centerY +
            (leftNodes.length / 2) * (nodeHeight + marginY) -
            (i + 1) * (nodeHeight + marginY),
      properties: {
        nodeWidth,
        nodeHeight,
        nodeText: node.label,
        pointId: node.pointId ?? '',
        nodeDirection: 'left',
        image: 'https://fanyi-cdn.cdn.bcebos.com/static/cat/asset/jpg.9b515fbd.png',
      },
    })
    sequence.push(node.id)
  })

  // 闭环连线
  console.log('sequence :>> ', sequence)

  const edges = sequence.map((id, index) => {
    const nextId = sequence[(index + 1) % sequence.length]
    // todo 节点组边文字
    // const edgeText = findItemById(id, dataList)?.text ?? ''
    return {
      sourceNodeId: id,
      targetNodeId: nextId,
      type: 'polyline',
      //   text: edgeText,
    }
  })

  // 解决最后一条线的问题
  try {
    let startPointLast = {
      x: nodes[nodes.length - 1].x - 50,
      y: nodes[nodes.length - 1].y - 50,
    }
    let endPointLast = {
      x: nodes[0].x + 50,
      y: nodes[0].y - 50,
    }
    let pointsListLast = [
      startPointLast,
      { x: nodes[nodes.length - 1].x - 50, y: nodes[nodes.length - 1].y - 100 },
      { x: nodes[0].x + 50, y: nodes[nodes.length - 1].y - 100 },
      endPointLast,
    ]
    edges[edges.length - 1].startPoint = startPointLast
    edges[edges.length - 1].endPoint = endPointLast
    edges[edges.length - 1].pointsList = pointsListLast
  } catch (error) {
    console.log('error :>> ', error)
  }

  return { nodes, edges }
}

const init = async () => {
  nextTick(() => {
    lf.value = new LogicFlow({
      container: document.querySelector('#container_flow'),
      grid: {
        size: 10,
        visible: true,
        type: 'mesh',
        config: {
          color: '#f5f5f5',
          thickness: 1,
        },
      },
      // todo 调试时候下面都注释 方便
      //   adjustEdge: false,
      //   adjustNodePosition: false,
      //   hideAnchors: true,
      //   hoverOutline: false,
      //   nodeSelectedOutline: false,
      //   edgeSelectedOutline: false,
      //   nodeTextEdit: false,
      //   edgeTextEdit: false,
      //   textEdit: false,
    })

    // todo 是否开启箭头(全局)
    // lf.value.setTheme({
    //   arrow: false,
    // })

    lf.value.register(TaskNode)
    lf.value.register(TaskLine)

    lf.value.on('history:change', () => {
      const data = lf.value.getGraphData()
      console.log('history:change', data)
    })

    lf.value.on('task_node_text:click', (data) => {
      console.log('点击了节点文本', data)
      // todo 弹窗打开查看文本
    })

    // todo 节点点击和边点击都在
    // lf.value.on('node:click,edge:click', (data) => {
    //   console.log('data :>> ', data)
    // })

    // 边 点击
    lf.value.on('edge:click', (data) => {
      console.log('点击了边 :>> ', data)
    })

    let nl = []
    let el = []
    dataList.forEach((ele, idx) => {
      nl = nl.concat(generateLogicflowGraph(ele, 1000 * idx, 0).nodes)
      el = el.concat(generateLogicflowGraph(ele, 1000 * idx, 0).edges)
    })

    nl.forEach((ele, idx) => {
      if (ele.properties.pointId) {
        el.push({
          sourceNodeId: ele.id,
          targetNodeId: ele.properties.pointId,
          type: 'bezier',
          text: findItemById(ele.id, dataList)?.text ?? '',
        })
      }
    })

    const graphData = {
      nodes: nl,
      edges: el,
    }
    console.log('graphData :>> ', graphData)
    lf.value.render(graphData)

    lf.value.fitView(160, 160)
  })
}

onMounted(() => {
  init()
})
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  background: #fff;
}
:deep(.task_node_box-wrapper) {
  box-sizing: border-box;
}
:deep(.task_node_box) {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
:deep(.task_node_text) {
  width: 50%;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
:deep(.task_node_img) {
  width: 50%;
  border: 2px solid #ddd;
  box-sizing: border-box;
  max-width: 50%;
  max-height: 100%;
}
</style>
