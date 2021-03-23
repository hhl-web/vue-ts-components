export const tableData = [
  {
    id: 1,
    text: "父1",
    level: 1,
    type: "自然属性",
    manage_categories: "无",
    remark: "无",
    children: [
      {
        id: 1 - 1,
        text: "子1",
        level: 2,
        type: "自然属性",
        manage_categories: "无",
        remark: "无",
        children: [],
        parent_id: 1
      },
      {
        id: 1 - 2,
        text: "子2",
        level: 2,
        type: "自然属性",
        manage_categories: "无",
        remark: "无",
        parent_id: 1,
        children: [
          {
            id: 1 - 2 - 1,
            text: "子2-子1",
            level: 3,
            type: "自然属性",
            manage_categories: "无",
            remark: "无",
            children: [],
            parent_id: 1 - 2
          },
          {
            id: 1 - 2 - 2,
            text: "子2-子2",
            level: 3,
            type: "自然属性",
            manage_categories: "无",
            remark: "无",
            children: [],
            parent_id: 1 - 2
          }
        ]
      }
    ]
  },
  {
    id: 2,
    text: "父2",
    level: 1,
    type: "分类属性",
    manage_categories: "无",
    remark: "无",

    children: [
      {
        id: 2 - 1,
        text: "父-子1",
        level: 2,
        type: "自然属性",
        manage_categories: "无",
        remark: "无",
        children: [],
        parent_id: 2
      }
    ]
  }
];
