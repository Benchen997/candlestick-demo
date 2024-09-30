"use client";
import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts/core";
import {
  DataZoomComponent,
  GridComponent,
  GridComponentOption,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from "echarts/components";
import {
  CandlestickChart,
  CandlestickSeriesOption,
  LineChart,
  LineSeriesOption,
} from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { KlineData, RawKlineData } from "@/model/types";

// Register the required components
echarts.use([
  GridComponent,
  CandlestickChart,
  CanvasRenderer,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  DataZoomComponent,
  LineChart,
]);

type EChartsOption = echarts.ComposeOption<
  GridComponentOption | CandlestickSeriesOption | LineSeriesOption
>;

export default function CandleStick() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [dataX, setDataX] = useState<string[]>([]);
  const [dataY, setDataY] = useState<number[][]>([]);

  function reformatData(data: RawKlineData[]) {
    return data.map((item: RawKlineData) => ({
      openTime: item[0],
      openPrice: item[1],
      highPrice: item[2],
      lowPrice: item[3],
      closePrice: item[4],
      volume: item[5],
      closeTime: item[6],
      quoteAssetVolume: item[7],
      numberOfTrades: item[8],
      takerBuyBaseAssetVolume: item[9],
      takerBuyQuoteAssetVolume: item[10],
      unusedField: item[11],
    }));
  }

  function calculateMA(dayCount: number): (number | string)[] {
    const result: (number | string)[] = [];
    for (let i = 0, len = dataY.length; i < len; i++) {
      if (i < dayCount) {
        result.push("-"); // Not enough data points for the moving average
        continue;
      }
      let sum = 0;
      for (let j = 0; j < dayCount; j++) {
        sum += dataY[i - j][1]; // Access the close price in the dataY array
      }
      result.push(sum / dayCount); // Calculate the moving average
    }
    return result;
  }

  // for fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data.json"); // Adjust path if necessary
        const rawData = await response.json();
        // Mapping raw array data to an object with key-value pairs
        const mappedData = reformatData(rawData);
        // Prepare the data for the candlestick chart

        const xData: string[] = mappedData.map((item: KlineData) => {
          const date = new Date(item.openTime);
          return `${date.getMonth() + 1}-${date.getDate()}`;
        });

        const yData: number[][] = mappedData.map((item: KlineData) => [
          parseFloat(item.openPrice), // Open price
          parseFloat(item.closePrice), // Close price
          parseFloat(item.lowPrice), // Low price
          parseFloat(item.highPrice), // High price
        ]);

        setDataX(xData);
        setDataY(yData);
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    fetchData();
  }, []);

  // for set up the chart
  useEffect(() => {
    const chartDom = chartRef.current;
    if (!chartDom || !dataX.length || !dataY.length) return;

    const myChart = echarts.init(chartDom);
    const option: EChartsOption = {
      title: {
        text: "Bitcoin Trend",
        left: 0,
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
        },
      },
      legend: {
        data: ["Day", "MA5", "MA10", "MA20", "MA30"],
      },
      grid: {
        left: "10%", // Adjust the left margin
        right: "10%", // Adjust the right margin
        bottom: "15%", // Adjust the bottom margin to accommodate the dataZoom slider
        top: "10%", // Adjust the top margin if necessary
      },
      xAxis: {
        type: "category",
        data: dataX,
        boundaryGap: true,
        axisLine: { onZero: false },
        splitLine: { show: false },
      },
      yAxis: {
        scale: true,
        boundaryGap: [0.01, 0.01],
        splitArea: {
          show: true,
        },
      },
      dataZoom: [
        {
          type: "inside",
          start: 50,
          end: 100,
        },
        {
          show: true,
          type: "slider",
          top: "90%", // Positioning of the slider
          start: 50,
          end: 100,
        },
      ],
      series: [
        {
          name: "Day",
          type: "candlestick",
          barMaxWidth: 20,
          data: dataY,
        },
        {
          name: "MA5",
          type: "line",
          data: calculateMA(5),
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: "MA10",
          type: "line",
          data: calculateMA(10),
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: "MA20",
          type: "line",
          data: calculateMA(20),
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        },
        {
          name: "MA30",
          type: "line",
          data: calculateMA(30),
          smooth: true,
          lineStyle: {
            opacity: 0.5,
          },
        }
      ],
    };

    myChart.setOption(option);

    // Clean up the chart instance on unmount
    return () => {
      myChart.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataX, dataY]);

  return <div ref={chartRef} className="w-full h-96" />;
}
