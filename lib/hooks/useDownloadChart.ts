import domtoimage from "dom-to-image";
import fileDownload from "js-file-download";
import { useTheme } from "next-themes";
import React, { useCallback } from "react";

export const useDownloadChart = (chartRef: React.RefObject<HTMLElement>) => {
  const { theme, systemTheme } = useTheme();

  const downloadChart = useCallback(() => {
    const executeDownload = async () => {
      const currentTheme = theme === "system" ? systemTheme : theme;
      const backgroundColor = currentTheme === "dark" ? "#1f2937" : "#ffffff";
      const element = chartRef.current;

      if (element) {
        const originalBackground = element.style.backgroundColor;
        element.style.backgroundColor = backgroundColor;

        try {
          const blob = await domtoimage.toBlob(element, {
            height: element.offsetHeight,
            width: element.offsetWidth,
            style: {
              backgroundColor,
            },
          });
          fileDownload(blob, "chart-image.png");
        } catch (error) {
          console.error("Error downloading the chart:", error);
        } finally {
          if (chartRef.current) {
            chartRef.current.style.backgroundColor = originalBackground;
          }
        }
      }
    };

    executeDownload();
  }, [chartRef, theme, systemTheme]);

  return downloadChart;
};
