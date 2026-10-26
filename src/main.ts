import './style.css';

import {
    Chart,
    LineSeries,
    DateTime,
    Tooltip,
    Legend
} from '@syncfusion/ej2-charts';

import {
    Grid,
    Page,
    Sort,
    Filter,
    Toolbar,
    ExcelExport,
    PdfExport,
} from '@syncfusion/ej2-grids';
import type {
    ExcelExportProperties,
    PdfExportProperties
} from '@syncfusion/ej2-grids';

import { Button } from '@syncfusion/ej2-buttons';
import { LinearGauge } from '@syncfusion/ej2-lineargauge';
import { CircularGauge } from '@syncfusion/ej2-circulargauge';

import sensorDataJson from './data/sensor-data.json';
import alarmDataJson from './data/alarm-data.json';

Chart.Inject(LineSeries, DateTime, Tooltip, Legend);
Grid.Inject(Page, Sort, Filter, Toolbar, ExcelExport, PdfExport);

// Load Local JSON Data
const sensorData: any[] = sensorDataJson.map((item: any) => ({
    ...item,
    timestamp: new Date(item.timestamp)
}));

const alarmData: any[] = [...alarmDataJson];

const latestReading = sensorData[sensorData.length - 1];
if (!latestReading) {
    throw new Error('The sensor sample dataset must contain at least one reading.');
}
const activeAlarmCount = alarmData.filter((alarm: any) => alarm.status === 'Active').length;

const setSummaryValue = (id: string, value: string): void => {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Dashboard summary element #${id} was not found.`);
    }
    element.textContent = value;
};

setSummaryValue('latest-level', `${latestReading.value}%`);
setSummaryValue('latest-quality', latestReading.quality);
setSummaryValue(
    'latest-reading-time',
    `Latest sample: ${latestReading.timestamp.toLocaleString()}`
);
setSummaryValue(
    'active-alarm-count',
    String(activeAlarmCount)
);
setSummaryValue('alarm-record-count', String(alarmData.length));

// RTL State
let isRtl = false;

// Create Chart
const chart = new Chart({
    enableRtl: isRtl,

    title: 'Tank Level Trend',

    primaryXAxis: {
        valueType: 'DateTime',
        title: 'Timestamp'
    },

    primaryYAxis: {
        title: 'Level (%)'
    },

    tooltip: {
        enable: true
    },

    series: [
        {
            type: 'Line',
            dataSource: sensorData,
            xName: 'timestamp',
            yName: 'value',
            name: 'Tank Level'
        }
    ]
});

chart.appendTo('#chart-container');

const linearGauge = new LinearGauge({
    width: '100%',
    height: '260px',
    orientation: 'Horizontal',
    axes: [
        {
            minimum: 0,
            maximum: 100,
            isInversed: isRtl,
            labelStyle: {
                format: '{value}%'
            },
            majorTicks: {
                interval: 20
            },
            pointers: [
                {
                    type: 'Bar',
                    value: latestReading.value,
                    color: '#0f9f9a'
                }
            ]
        }
    ]
});

linearGauge.appendTo('#linear-gauge');

const circularGauge = new CircularGauge({
    width: '100%',
    height: '260px',
    axes: [
        {
            minimum: 0,
            maximum: Math.max(alarmData.length, 1),
            startAngle: 210,
            endAngle: 150,
            direction: isRtl ? 'AntiClockWise' : 'ClockWise',
            majorTicks: {
                interval: 1
            },
            pointers: [
                {
                    value: activeAlarmCount,
                    color: '#c28a18'
                }
            ]
        }
    ]
});

circularGauge.appendTo('#circular-gauge');

// Create Grid
const grid = new Grid({
    enableRtl: isRtl,

    dataSource: alarmData,

    allowPaging: true,
    allowSorting: true,
    allowFiltering: true,
    allowExcelExport: true,
    allowPdfExport: true,
    toolbar: ['ExcelExport', 'PdfExport'],

    pageSettings: {
        pageSize: 6
    },

    columns: [
        {
            field: 'id',
            headerText: 'Alarm ID',
            width: 100
        },
        {
            field: 'timestamp',
            headerText: 'Timestamp',
            width: 180
        },
        {
            field: 'severity',
            headerText: 'Severity',
            width: 120
        },
        {
            field: 'status',
            headerText: 'Status',
            width: 140
        },
        {
            field: 'quality',
            headerText: 'Quality',
            width: 120
        },
        {
            field: 'message',
            headerText: 'Message',
            width: 250
        }
    ]
});

grid.toolbarClick = (args) => {
    if (args.item.id === `${grid.element.id}_pdfexport`) {
        const exportProperties: PdfExportProperties = {
            exportType: 'AllPages'
        };
        grid.pdfExport(exportProperties);
    } else if (args.item.id === `${grid.element.id}_excelexport`) {
        const exportProperties: ExcelExportProperties = {
            exportType: 'AllPages'
        };
        grid.excelExport(exportProperties);
    }
};

grid.appendTo('#grid-container');

// RTL Toggle Button
const rtlButton = new Button({
    content: 'Toggle RTL',
    isToggle: true,
    isPrimary: true
});

rtlButton.appendTo('#rtlToggle');
rtlButton.element.addEventListener('click', () => {
    isRtl = !isRtl;

    chart.enableRtl = isRtl;
    chart.refresh();

    grid.enableRtl = isRtl;
    grid.refresh();

    linearGauge.axes[0].isInversed = isRtl;
    linearGauge.refresh();

    circularGauge.axes[0].direction = isRtl ? 'AntiClockWise' : 'ClockWise';
    circularGauge.refresh();

    rtlButton.content = isRtl ? 'Disable RTL' : 'Toggle RTL';
    rtlButton.dataBind();
});
