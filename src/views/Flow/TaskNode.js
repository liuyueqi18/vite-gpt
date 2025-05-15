import { HtmlNodeModel, HtmlNode } from '@logicflow/core'

const defaultWidth = 240
const defaultHeight = 100
class TaskModel extends HtmlNodeModel {
  setAttributes() {
    // 设置节点宽高和锚点
    const width = this.properties?.nodeWidth ? this.properties.nodeWidth : defaultWidth
    const height = this.properties?.nodeHeight ? this.properties.nodeHeight : defaultHeight
    this.width = width
    this.height = height
    this.anchorsOffset = [
      [width / 2, 0],
      [0, height / 2],
      [-width / 2, 0],
      [0, -height / 2],
    ]
  }
}
class TaskView extends HtmlNode {
  setHtml(rootEl) {
    const { properties } = this.props.model
    const nodeHeight = properties?.nodeHeight ? `${properties?.nodeHeight}px` : `${defaultHeight}px`
    const nodeWidth = properties?.nodeWidth ? `${properties?.nodeWidth}px` : `${defaultWidth}px`

    const el = document.createElement('div')
    el.className = 'task_node_box-wrapper'

    const html = `
        <div class="task_node_box" style="height:${nodeHeight};width:${nodeWidth}">
            <img class="task_node_img" src="${properties.image}" alt="">
            <div class="task_node_text" style="font-size:12px;">${properties.nodeText}</div>
        </div>
      `
    //

    el.innerHTML = html
    // 需要先把之前渲染的子节点清除掉。
    rootEl.innerHTML = ''
    rootEl.appendChild(el)
  }
}

export default {
  type: 'TaskNode',
  view: TaskView,
  model: TaskModel,
}
