import { PolylineEdge, PolylineEdgeModel } from '@logicflow/core'

class TaskLineModel extends PolylineEdgeModel {
  getEdgeStyle() {
    const style = super.getEdgeStyle()
    const { properties } = this
    style.stroke = '#999'

    return style
  }
}

export default {
  type: 'TaskLine',
  view: PolylineEdge,
  model: TaskLineModel,
}
