import { HtmlNodeModel, HtmlNode } from '@logicflow/core'

const defaultWidth = 240
const defaultHeight = 100
class TaskModel extends HtmlNodeModel {
  setAttributes() {
    // 设置节点宽高和锚点
    const width = this.properties?.nodeWidth ? this.properties.nodeWidth : defaultWidth
    const height = this.properties?.nodeHeight ? this.properties.nodeHeight : defaultHeight
    const nodeDirection = this.properties?.nodeDirection ?? ''
    this.width = width
    this.height = height
    if (nodeDirection === 'left') {
      this.anchorsOffset = [
        [-width / 4, height / 2],
        [-width / 4, -height / 2],
      ]
    }
    if (nodeDirection === 'bottom') {
      this.anchorsOffset = [
        [width / 4, 0],
        [-width / 4, 0],
      ]
    }
    if (nodeDirection === 'right') {
      this.anchorsOffset = [
        [width / 4, height / 2],
        [width / 4, -height / 2],
      ]
    }
  }
}
class TaskView extends HtmlNode {
  setHtml(rootEl) {
    const { properties, id } = this.props.model
    const nodeHeight = properties?.nodeHeight ? `${properties?.nodeHeight}px` : `${defaultHeight}px`
    const nodeWidth = properties?.nodeWidth ? `${properties?.nodeWidth}px` : `${defaultWidth}px`
    const flexDirection = properties?.flexDirection ? properties.flexDirection : 'row'
    const el = document.createElement('div')
    el.className = 'task_node_box-wrapper'

    const html = `
        <div class="task_node_box" style="height:${nodeHeight};width:${nodeWidth};flex-direction:${flexDirection}">
          <img class="task_node_img" src="${properties.image}" alt="">
          <div class="task_node_text" style="font-size:12px;cursor:pointer;">${properties.nodeText}</div>
        </div>
      `
    el.innerHTML = html

    // 清除旧内容
    rootEl.innerHTML = ''
    rootEl.appendChild(el)

    // 给 .task_node_text 添加事件
    const textEl = rootEl.querySelector('.task_node_text')
    if (textEl) {
      textEl.addEventListener('click', (e) => {
        e.stopPropagation() // 阻止冒泡，防止触发 LogicFlow 其他点击事件
        // 触发自定义事件，携带节点id
        this.props.graphModel.eventCenter.emit('task_node_text:click', {
          id,
          properties,
        })
      })
    }
  }
}

export default {
  type: 'TaskNode',
  view: TaskView,
  model: TaskModel,
}
