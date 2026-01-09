# ECharts 图表示例文档

这个文档展示了如何在Markdown中嵌入ECharts图表。

## 1. 柱状图

<div id="barChart" style="width: 100%; height: 400px; margin: 20px 0;"></div>

<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
<script>
(function() {
    var barChart = echarts.init(document.getElementById('barChart'));
    var option = {
        title: {
            text: '月度销售额',
            left: 'center',
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月', '6月'],
            axisLabel: {
                fontSize: 12
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                fontSize: 12
            }
        },
        series: [{
            name: '销售额',
            type: 'bar',
            data: [120, 200, 150, 80, 70, 110],
            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {offset: 0, color: '#83bff6'},
                    {offset: 0.5, color: '#188df0'},
                    {offset: 1, color: '#188df0'}
                ])
            },
            emphasis: {
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {offset: 0, color: '#2378f7'},
                        {offset: 0.7, color: '#2378f7'},
                        {offset: 1, color: '#83bff6'}
                    ])
                }
            }
        }]
    };
    barChart.setOption(option);
    
    // 响应式调整
    window.addEventListener('resize', function() {
        barChart.resize();
    });
})();
</script>

## 2. 折线图

<div id="lineChart" style="width: 100%; height: 400px; margin: 20px 0;"></div>

<script>
(function() {
    var lineChart = echarts.init(document.getElementById('lineChart'));
    var option = {
        title: {
            text: '用户增长趋势',
            left: 'center',
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['新用户', '活跃用户'],
            top: 40
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '新用户',
                type: 'line',
                stack: 'Total',
                smooth: true,
                data: [120, 132, 101, 134, 90, 230, 210],
                itemStyle: {
                    color: '#667eea'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {offset: 0, color: 'rgba(102, 126, 234, 0.3)'},
                        {offset: 1, color: 'rgba(102, 126, 234, 0.1)'}
                    ])
                }
            },
            {
                name: '活跃用户',
                type: 'line',
                stack: 'Total',
                smooth: true,
                data: [220, 182, 191, 234, 290, 330, 310],
                itemStyle: {
                    color: '#764ba2'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {offset: 0, color: 'rgba(118, 75, 162, 0.3)'},
                        {offset: 1, color: 'rgba(118, 75, 162, 0.1)'}
                    ])
                }
            }
        ]
    };
    lineChart.setOption(option);
    
    window.addEventListener('resize', function() {
        lineChart.resize();
    });
})();
</script>

## 3. 饼图

<div id="pieChart" style="width: 100%; height: 400px; margin: 20px 0;"></div>

<script>
(function() {
    var pieChart = echarts.init(document.getElementById('pieChart'));
    var option = {
        title: {
            text: '产品占比',
            left: 'center',
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 60
        },
        series: [
            {
                name: '产品占比',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 20,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: 1048, name: '产品A', itemStyle: {color: '#667eea'}},
                    {value: 735, name: '产品B', itemStyle: {color: '#764ba2'}},
                    {value: 580, name: '产品C', itemStyle: {color: '#f093fb'}},
                    {value: 484, name: '产品D', itemStyle: {color: '#4facfe'}},
                    {value: 300, name: '产品E', itemStyle: {color: '#43e97b'}}
                ]
            }
        ]
    };
    pieChart.setOption(option);
    
    window.addEventListener('resize', function() {
        pieChart.resize();
    });
})();
</script>

## 4. 雷达图

<div id="radarChart" style="width: 100%; height: 400px; margin: 20px 0;"></div>

<script>
(function() {
    var radarChart = echarts.init(document.getElementById('radarChart'));
    var option = {
        title: {
            text: '能力评估雷达图',
            left: 'center',
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold'
            }
        },
        radar: {
            indicator: [
                {name: '技术能力', max: 100},
                {name: '沟通能力', max: 100},
                {name: '团队协作', max: 100},
                {name: '学习能力', max: 100},
                {name: '创新能力', max: 100},
                {name: '执行力', max: 100}
            ],
            center: ['50%', '55%'],
            radius: '60%'
        },
        series: [
            {
                name: '能力评估',
                type: 'radar',
                data: [
                    {
                        value: [85, 90, 75, 95, 80, 88],
                        name: '张三',
                        areaStyle: {
                            color: 'rgba(102, 126, 234, 0.3)'
                        },
                        itemStyle: {
                            color: '#667eea'
                        }
                    },
                    {
                        value: [75, 85, 90, 80, 85, 90],
                        name: '李四',
                        areaStyle: {
                            color: 'rgba(118, 75, 162, 0.3)'
                        },
                        itemStyle: {
                            color: '#764ba2'
                        }
                    }
                ]
            }
        ]
    };
    radarChart.setOption(option);
    
    window.addEventListener('resize', function() {
        radarChart.resize();
    });
})();
</script>

## 5. 散点图

<div id="scatterChart" style="width: 100%; height: 400px; margin: 20px 0;"></div>

<script>
(function() {
    var scatterChart = echarts.init(document.getElementById('scatterChart'));
    
    // 生成模拟数据
    var data = [];
    for (var i = 0; i < 100; i++) {
        data.push([
            Math.random() * 100,
            Math.random() * 100
        ]);
    }
    
    var option = {
        title: {
            text: '数据分布散点图',
            left: 'center',
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                return 'X: ' + params.value[0].toFixed(2) + '<br/>Y: ' + params.value[1].toFixed(2);
            }
        },
        xAxis: {
            type: 'value',
            scale: true
        },
        yAxis: {
            type: 'value',
            scale: true
        },
        series: [{
            name: '数据点',
            type: 'scatter',
            data: data,
            symbolSize: function(data) {
                return Math.sqrt(data[0] + data[1]) * 2;
            },
            itemStyle: {
                color: function(params) {
                    var colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];
                    return colors[params.dataIndex % colors.length];
                },
                opacity: 0.7
            }
        }]
    };
    scatterChart.setOption(option);
    
    window.addEventListener('resize', function() {
        scatterChart.resize();
    });
})();
</script>

## 6. 仪表盘

<div id="gaugeChart" style="width: 100%; height: 400px; margin: 20px 0;"></div>

<script>
(function() {
    var gaugeChart = echarts.init(document.getElementById('gaugeChart'));
    var option = {
        title: {
            text: '项目完成度',
            left: 'center',
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold'
            }
        },
        series: [
            {
                name: '完成度',
                type: 'gauge',
                progress: {
                    show: true,
                    width: 18
                },
                axisLine: {
                    lineStyle: {
                        width: 18
                    }
                },
                axisTick: {
                    show: false
                },
                splitLine: {
                    length: 15,
                    lineStyle: {
                        width: 2,
                        color: '#999'
                    }
                },
                axisLabel: {
                    distance: 25,
                    color: '#999',
                    fontSize: 12
                },
                anchor: {
                    show: true,
                    showAbove: true,
                    size: 25,
                    itemStyle: {
                        borderWidth: 10
                    }
                },
                title: {
                    show: false
                },
                detail: {
                    valueAnimation: true,
                    fontSize: 30,
                    offsetCenter: [0, '70%'],
                    formatter: '{value}%'
                },
                data: [
                    {
                        value: 75,
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                                {offset: 0, color: '#667eea'},
                                {offset: 1, color: '#764ba2'}
                            ])
                        }
                    }
                ]
            }
        ]
    };
    gaugeChart.setOption(option);
    
    // 模拟动态更新
    setInterval(function() {
        var value = Math.random() * 100;
        gaugeChart.setOption({
            series: [{
                data: [{
                    value: value.toFixed(0)
                }]
            }]
        });
    }, 3000);
    
    window.addEventListener('resize', function() {
        gaugeChart.resize();
    });
})();
</script>

## 7. 组合图表（柱状图 + 折线图）

<div id="mixedChart" style="width: 100%; height: 400px; margin: 20px 0;"></div>

<script>
(function() {
    var mixedChart = echarts.init(document.getElementById('mixedChart'));
    var option = {
        title: {
            text: '销售与利润分析',
            left: 'center',
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['销售额', '利润', '利润率'],
            top: 40
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月'],
                axisPointer: {
                    type: 'shadow'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '金额',
                position: 'left',
                axisLabel: {
                    formatter: '{value} 万'
                }
            },
            {
                type: 'value',
                name: '百分比',
                position: 'right',
                axisLabel: {
                    formatter: '{value}%'
                }
            }
        ],
        series: [
            {
                name: '销售额',
                type: 'bar',
                data: [120, 200, 150, 80, 70, 110],
                itemStyle: {
                    color: '#667eea'
                }
            },
            {
                name: '利润',
                type: 'bar',
                data: [30, 50, 40, 20, 18, 28],
                itemStyle: {
                    color: '#764ba2'
                }
            },
            {
                name: '利润率',
                type: 'line',
                yAxisIndex: 1,
                data: [25, 25, 26.7, 25, 25.7, 25.5],
                itemStyle: {
                    color: '#f093fb'
                },
                lineStyle: {
                    width: 3
                }
            }
        ]
    };
    mixedChart.setOption(option);
    
    window.addEventListener('resize', function() {
        mixedChart.resize();
    });
})();
</script>

## 8. 3D柱状图（需要echarts-gl）

<div id="bar3dChart" style="width: 100%; height: 400px; margin: 20px 0;"></div>

<script src="https://cdn.jsdelivr.net/npm/echarts-gl@2.0.9/dist/echarts-gl.min.js"></script>
<script>
(function() {
    var bar3dChart = echarts.init(document.getElementById('bar3dChart'));
    
    var hours = ['12a', '1a', '2a', '3a', '4a', '5a', '6a',
        '7a', '8a', '9a','10a','11a',
        '12p', '1p', '2p', '3p', '4p', '5p',
        '6p', '7p', '8p', '9p', '10p', '11p'];
    var days = ['Saturday', 'Friday', 'Thursday',
        'Wednesday', 'Tuesday', 'Monday', 'Sunday'];
    
    var data = [];
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 24; j++) {
            data.push([j, i, Math.random() * 100]);
        }
    }
    
    var option = {
        title: {
            text: '3D柱状图示例',
            left: 'center',
            textStyle: {
                fontSize: 18,
                fontWeight: 'bold'
            }
        },
        tooltip: {},
        visualMap: {
            max: 100,
            inRange: {
                color: ['#667eea', '#764ba2', '#f093fb']
            },
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '15%'
        },
        xAxis3D: {
            type: 'category',
            data: hours
        },
        yAxis3D: {
            type: 'category',
            data: days
        },
        zAxis3D: {
            type: 'value'
        },
        grid3D: {
            boxWidth: 200,
            boxDepth: 80,
            viewControl: {
                projection: 'orthographic'
            },
            light: {
                main: {
                    intensity: 1.2,
                    shadow: true
                },
                ambient: {
                    intensity: 0.3
                }
            }
        },
        series: [{
            type: 'bar3D',
            data: data,
            shading: 'lambert',
            label: {
                show: false
            },
            emphasis: {
                label: {
                    show: true
                }
            }
        }]
    };
    bar3dChart.setOption(option);
    
    window.addEventListener('resize', function() {
        bar3dChart.resize();
    });
})();
</script>

## 使用说明

### 基本用法

1. **引入ECharts库**：
   ```html
   <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
   ```

2. **创建容器**：
   ```html
   <div id="chartId" style="width: 100%; height: 400px;"></div>
   ```

3. **初始化图表**：
   ```javascript
   var chart = echarts.init(document.getElementById('chartId'));
   chart.setOption(option);
   ```

### 响应式处理

为了确保图表在不同屏幕尺寸下正常显示，建议添加窗口大小调整监听：

```javascript
window.addEventListener('resize', function() {
    chart.resize();
});
```

### 注意事项

- ✅ ECharts图表在Markdown预览中完全可用
- ✅ 支持所有ECharts图表类型
- ✅ 支持交互功能（缩放、拖拽、提示框等）
- ✅ 支持响应式布局
- ⚠️ 3D图表需要额外引入 `echarts-gl` 库
- ⚠️ 确保网络连接正常以加载CDN资源

### 更多资源

- [ECharts官方文档](https://echarts.apache.org/zh/index.html)
- [ECharts示例库](https://echarts.apache.org/examples/zh/index.html)
- [ECharts配置项手册](https://echarts.apache.org/zh/option.html)

---

**提示**：你可以复制这些示例代码，修改数据和样式来创建自己的图表！
