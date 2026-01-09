# ECharts 图表示例文档

这个文档展示了如何在 Markdown 中使用 `echarts` 代码块嵌入 ECharts 图表。

## 1. 柱状图

```echarts
{
  "title": {
    "text": "月度销售额",
    "left": "center",
    "textStyle": {
      "fontSize": 18,
      "fontWeight": "bold"
    }
  },
  "tooltip": {
    "trigger": "axis",
    "axisPointer": {
      "type": "shadow"
    }
  },
  "grid": {
    "left": "3%",
    "right": "4%",
    "bottom": "3%",
    "containLabel": true
  },
  "xAxis": {
    "type": "category",
    "data": ["1月", "2月", "3月", "4月", "5月", "6月"],
    "axisLabel": {
      "fontSize": 12
    }
  },
  "yAxis": {
    "type": "value",
    "axisLabel": {
      "fontSize": 12
    }
  },
  "series": [{
    "name": "销售额",
    "type": "bar",
    "data": [120, 200, 150, 80, 70, 110],
    "itemStyle": {
      "color": "#188df0"
    },
    "emphasis": {
      "itemStyle": {
        "color": "#2378f7"
      }
    }
  }]
}
```

## 2. 折线图

```echarts
{
  "title": {
    "text": "用户增长趋势",
    "left": "center",
    "textStyle": {
      "fontSize": 18,
      "fontWeight": "bold"
    }
  },
  "tooltip": {
    "trigger": "axis"
  },
  "legend": {
    "data": ["新用户", "活跃用户"],
    "top": 40
  },
  "grid": {
    "left": "3%",
    "right": "4%",
    "bottom": "3%",
    "containLabel": true
  },
  "xAxis": {
    "type": "category",
    "boundaryGap": false,
    "data": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
  },
  "yAxis": {
    "type": "value"
  },
  "series": [
    {
      "name": "新用户",
      "type": "line",
      "stack": "Total",
      "smooth": true,
      "data": [120, 132, 101, 134, 90, 230, 210],
      "itemStyle": {
        "color": "#667eea"
      },
      "areaStyle": {
        "opacity": 0.3
      }
    },
    {
      "name": "活跃用户",
      "type": "line",
      "stack": "Total",
      "smooth": true,
      "data": [220, 182, 191, 234, 290, 330, 310],
      "itemStyle": {
        "color": "#764ba2"
      },
      "areaStyle": {
        "opacity": 0.3
      }
    }
  ]
}
```

## 3. 饼图

```echarts
{
  "title": {
    "text": "产品占比",
    "left": "center",
    "textStyle": {
      "fontSize": 18,
      "fontWeight": "bold"
    }
  },
  "tooltip": {
    "trigger": "item",
    "formatter": "{a} <br/>{b}: {c} ({d}%)"
  },
  "legend": {
    "orient": "vertical",
    "left": "left",
    "top": 60
  },
  "series": [
    {
      "name": "产品占比",
      "type": "pie",
      "radius": ["40%", "70%"],
      "avoidLabelOverlap": false,
      "itemStyle": {
        "borderRadius": 10,
        "borderColor": "#fff",
        "borderWidth": 2
      },
      "label": {
        "show": false,
        "position": "center"
      },
      "emphasis": {
        "label": {
          "show": true,
          "fontSize": 20,
          "fontWeight": "bold"
        }
      },
      "labelLine": {
        "show": false
      },
      "data": [
        {"value": 1048, "name": "产品A", "itemStyle": {"color": "#667eea"}},
        {"value": 735, "name": "产品B", "itemStyle": {"color": "#764ba2"}},
        {"value": 580, "name": "产品C", "itemStyle": {"color": "#f093fb"}},
        {"value": 484, "name": "产品D", "itemStyle": {"color": "#4facfe"}},
        {"value": 300, "name": "产品E", "itemStyle": {"color": "#43e97b"}}
      ]
    }
  ]
}
```

## 4. 雷达图

```echarts
{
  "title": {
    "text": "能力评估雷达图",
    "left": "center",
    "textStyle": {
      "fontSize": 18,
      "fontWeight": "bold"
    }
  },
  "radar": {
    "indicator": [
      {"name": "技术能力", "max": 100},
      {"name": "沟通能力", "max": 100},
      {"name": "团队协作", "max": 100},
      {"name": "学习能力", "max": 100},
      {"name": "创新能力", "max": 100},
      {"name": "执行力", "max": 100}
    ],
    "center": ["50%", "55%"],
    "radius": "60%"
  },
  "series": [
    {
      "name": "能力评估",
      "type": "radar",
      "data": [
        {
          "value": [85, 90, 75, 95, 80, 88],
          "name": "张三",
          "areaStyle": {
            "opacity": 0.3
          },
          "itemStyle": {
            "color": "#667eea"
          }
        },
        {
          "value": [75, 85, 90, 80, 85, 90],
          "name": "李四",
          "areaStyle": {
            "opacity": 0.3
          },
          "itemStyle": {
            "color": "#764ba2"
          }
        }
      ]
    }
  ]
}
```

## 5. 散点图

```echarts
{
  "title": {
    "text": "数据分布散点图",
    "left": "center",
    "textStyle": {
      "fontSize": 18,
      "fontWeight": "bold"
    }
  },
  "tooltip": {
    "trigger": "item"
  },
  "xAxis": {
    "type": "value",
    "scale": true
  },
  "yAxis": {
    "type": "value",
    "scale": true
  },
  "series": [{
    "name": "数据点",
    "type": "scatter",
    "data": [
      [23.5, 45.2], [45.8, 67.3], [12.3, 34.5], [67.8, 89.1], [34.2, 56.7],
      [78.9, 12.4], [56.3, 78.9], [89.1, 23.6], [23.7, 45.8], [45.1, 67.2],
      [12.8, 34.1], [67.2, 89.5], [34.8, 56.2], [78.3, 12.7], [56.7, 78.3],
      [89.5, 23.2], [23.1, 45.5], [45.5, 67.8], [12.5, 34.8], [67.5, 89.2]
    ],
    "symbolSize": 10,
    "itemStyle": {
      "color": "#667eea",
      "opacity": 0.7
    }
  }]
}
```

## 6. 仪表盘

```echarts
{
  "title": {
    "text": "项目完成度",
    "left": "center",
    "textStyle": {
      "fontSize": 18,
      "fontWeight": "bold"
    }
  },
  "series": [
    {
      "name": "完成度",
      "type": "gauge",
      "progress": {
        "show": true,
        "width": 18
      },
      "axisLine": {
        "lineStyle": {
          "width": 18
        }
      },
      "axisTick": {
        "show": false
      },
      "splitLine": {
        "length": 15,
        "lineStyle": {
          "width": 2,
          "color": "#999"
        }
      },
      "axisLabel": {
        "distance": 25,
        "color": "#999",
        "fontSize": 12
      },
      "anchor": {
        "show": true,
        "showAbove": true,
        "size": 25,
        "itemStyle": {
          "borderWidth": 10
        }
      },
      "title": {
        "show": false
      },
      "detail": {
        "valueAnimation": true,
        "fontSize": 30,
        "offsetCenter": [0, "70%"],
        "formatter": "{value}%"
      },
      "data": [
        {
          "value": 75,
          "itemStyle": {
            "color": "#667eea"
          }
        }
      ]
    }
  ]
}
```

## 7. 组合图表（柱状图 + 折线图）

```echarts
{
  "title": {
    "text": "销售与利润分析",
    "left": "center",
    "textStyle": {
      "fontSize": 18,
      "fontWeight": "bold"
    }
  },
  "tooltip": {
    "trigger": "axis",
    "axisPointer": {
      "type": "cross"
    }
  },
  "legend": {
    "data": ["销售额", "利润", "利润率"],
    "top": 40
  },
  "grid": {
    "left": "3%",
    "right": "4%",
    "bottom": "3%",
    "containLabel": true
  },
  "xAxis": [
    {
      "type": "category",
      "data": ["1月", "2月", "3月", "4月", "5月", "6月"],
      "axisPointer": {
        "type": "shadow"
      }
    }
  ],
  "yAxis": [
    {
      "type": "value",
      "name": "金额",
      "position": "left",
      "axisLabel": {
        "formatter": "{value} 万"
      }
    },
    {
      "type": "value",
      "name": "百分比",
      "position": "right",
      "axisLabel": {
        "formatter": "{value}%"
      }
    }
  ],
  "series": [
    {
      "name": "销售额",
      "type": "bar",
      "data": [120, 200, 150, 80, 70, 110],
      "itemStyle": {
        "color": "#667eea"
      }
    },
    {
      "name": "利润",
      "type": "bar",
      "data": [30, 50, 40, 20, 18, 28],
      "itemStyle": {
        "color": "#764ba2"
      }
    },
    {
      "name": "利润率",
      "type": "line",
      "yAxisIndex": 1,
      "data": [25, 25, 26.7, 25, 25.7, 25.5],
      "itemStyle": {
        "color": "#f093fb"
      },
      "lineStyle": {
        "width": 3
      }
    }
  ]
}
```

## 8. 使用 JavaScript 对象字面量格式

除了 JSON 格式，你也可以使用 JavaScript 对象字面量格式：

```echarts
{
  title: {
    text: '示例图表',
    left: 'center'
  },
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [820, 932, 901, 934, 1290, 1330, 1320],
    type: 'line',
    smooth: true
  }]
}
```

## 使用说明

### 基本用法

在 Markdown 中使用 `echarts` 代码块，直接在代码块中编写 ECharts 配置：

````markdown
```echarts
{
  "title": {
    "text": "示例图表"
  },
  "xAxis": {
    "type": "category",
    "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  },
  "yAxis": {
    "type": "value"
  },
  "series": [{
    "data": [820, 932, 901, 934, 1290, 1330, 1320],
    "type": "line"
  }]
}
```
````

### 支持的格式

1. **JSON 格式**：标准的 JSON 格式，所有键和字符串值都需要用双引号包裹
2. **JavaScript 对象字面量格式**：可以使用单引号、不带引号的键名等 JavaScript 语法

### 特性

- ✅ 自动响应式调整（窗口大小变化时自动调整）
- ✅ 支持暗色/亮色主题切换
- ✅ 移动端适配
- ✅ 错误提示（配置错误时会显示错误信息）
- ✅ 支持所有 ECharts 图表类型
- ✅ 支持交互功能（缩放、拖拽、提示框等）

### 注意事项

- ⚠️ 3D 图表需要额外引入 `echarts-gl` 库（当前版本暂不支持）
- ⚠️ 某些高级功能（如 `echarts.graphic.LinearGradient`）需要使用纯色值替代
- ⚠️ 确保网络连接正常以加载 ECharts 库

### 更多资源

- [ECharts 官方文档](https://echarts.apache.org/zh/index.html)
- [ECharts 示例库](https://echarts.apache.org/examples/zh/index.html)
- [ECharts 配置项手册](https://echarts.apache.org/zh/option.html)

---

**提示**：你可以复制这些示例代码，修改数据和样式来创建自己的图表！
