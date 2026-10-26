import './style.css';
import {
    L10n,
    loadCldr,
    setCulture
} from '@syncfusion/ej2-base';
import arCldrData from '@syncfusion/ej2-cldr-data/main/ar/all.json';
import numberingSystems from '@syncfusion/ej2-cldr-data/supplemental/numberingSystems.json';
import {
    Chart,
    DateTime,
    Legend,
    LineSeries,
    Tooltip
} from '@syncfusion/ej2-charts';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import arabicLocale from '@syncfusion/ej2-locale/src/ar.json';
import {
    ExcelExport,
    Filter,
    Grid,
    Page,
    PdfExport,
    Sort,
    Toolbar
} from '@syncfusion/ej2-grids';
import type {
    ExcelExportProperties,
    PdfExportProperties
} from '@syncfusion/ej2-grids';
import { CircularGauge } from '@syncfusion/ej2-circulargauge';
import { LinearGauge } from '@syncfusion/ej2-lineargauge';

import sensorDataJson from './data/sensor-data.json';
import alarmDataJson from './data/alarm-data.json';

loadCldr(arCldrData, numberingSystems);

Chart.Inject(LineSeries, DateTime, Tooltip, Legend);
Grid.Inject(Page, Sort, Filter, Toolbar, ExcelExport, PdfExport);

type Language = 'en-US' | 'ar';

const translations = {
    'en-US': {
        eyebrow: 'MICROGUARD / OPERATIONS',
        title: 'Tank Monitoring',
        description: 'Sensor performance and alarm history for the monitored tank.',
        localization: 'Localization',
        summary: 'Sample monitoring summary',
        latestLevel: 'Latest tank level',
        latestQuality: 'Latest data quality',
        qualityDetail: 'Quality at the latest sensor reading',
        activeAlarms: 'Active alarms',
        activeAlarmDetail: 'Active records in the sample history',
        alarmRecords: 'Alarm records',
        alarmRecordDetail: 'Independent alarm JSON records',
        chartHeading: 'Tank level trend',
        chartDescription: 'Historical sensor readings from the sample dataset',
        gridHeading: 'Alarm history',
        gridDescription: 'Separate alarm records loaded from the sample dataset',
        levelGaugeHeading: 'Current tank level',
        levelGaugeDescription: 'Latest sensor reading, on a 0-100% scale',
        alarmGaugeHeading: 'Active alarms',
        alarmGaugeDescription: 'Active records compared with total sample alarms',
        latestSample: 'Latest sample',
        chartTitle: 'Tank Level Trend',
        timestamp: 'Timestamp',
        level: 'Level (%)',
        tankLevel: 'Tank Level',
        columns: ['Alarm ID', 'Timestamp', 'Severity', 'Status', 'Quality', 'Message'],
        quality: { Good: 'Good', Bad: 'Bad', Stale: 'Stale' },
        severity: { High: 'High', Medium: 'Medium', Low: 'Low' },
        status: { Active: 'Active', Acknowledged: 'Acknowledged', Closed: 'Closed' },
        messages: {
            'Tank Level High': 'Tank Level High',
            'Sensor Communication Lost': 'Sensor Communication Lost',
            'Data Update Delayed': 'Data Update Delayed',
            'Tank Pressure High': 'Tank Pressure High',
            'Flow Sensor Communication Lost': 'Flow Sensor Communication Lost',
            'Temperature Returned to Normal': 'Temperature Returned to Normal',
            'Tank Level Reading Delayed': 'Tank Level Reading Delayed',
            'Flow Rate Outside Expected Range': 'Flow Rate Outside Expected Range',
            'Backup Sensor Communication Lost': 'Backup Sensor Communication Lost',
            'Tank Level Critical': 'Tank Level Critical'
        }
    },
    ar: {
        eyebrow: 'مايكروغارد / العمليات',
        title: 'مراقبة الخزان',
        description: 'أداء المستشعر وسجل الإنذارات للخزان الخاضع للمراقبة.',
        localization: 'Localization',
        summary: 'ملخص بيانات المراقبة',
        latestLevel: 'أحدث مستوى للخزان',
        latestQuality: 'جودة أحدث بيانات',
        qualityDetail: 'جودة أحدث قراءة للمستشعر',
        activeAlarms: 'الإنذارات النشطة',
        activeAlarmDetail: 'السجلات النشطة في سجل العينة',
        alarmRecords: 'سجلات الإنذارات',
        alarmRecordDetail: 'سجلات الإنذار من بيانات العينة',
        chartHeading: 'اتجاه مستوى الخزان',
        chartDescription: 'قراءات المستشعر السابقة من مجموعة بيانات العينة',
        gridHeading: 'سجل الإنذارات',
        gridDescription: 'سجلات إنذار منفصلة محمّلة من مجموعة بيانات العينة',
        levelGaugeHeading: 'مستوى الخزان الحالي',
        levelGaugeDescription: 'أحدث قراءة للمستشعر على مقياس من ٠ إلى ١٠٠٪',
        alarmGaugeHeading: 'الإنذارات النشطة',
        alarmGaugeDescription: 'السجلات النشطة مقارنة بإجمالي إنذارات العينة',
        latestSample: 'أحدث قراءة',
        chartTitle: 'اتجاه مستوى الخزان',
        timestamp: 'الطابع الزمني',
        level: 'المستوى (٪)',
        tankLevel: 'مستوى الخزان',
        columns: ['معرّف الإنذار', 'الطابع الزمني', 'الخطورة', 'الحالة', 'الجودة', 'الرسالة'],
        quality: { Good: 'جيدة', Bad: 'سيئة', Stale: 'قديمة' },
        severity: { High: 'عالية', Medium: 'متوسطة', Low: 'منخفضة' },
        status: { Active: 'نشط', Acknowledged: 'تم الإقرار', Closed: 'مغلق' },
        messages: {
            'Tank Level High': 'مستوى الخزان مرتفع',
            'Sensor Communication Lost': 'انقطع الاتصال بالمستشعر',
            'Data Update Delayed': 'تأخر تحديث البيانات',
            'Tank Pressure High': 'ضغط الخزان مرتفع',
            'Flow Sensor Communication Lost': 'انقطع الاتصال بمستشعر التدفق',
            'Temperature Returned to Normal': 'عادت درجة الحرارة إلى الوضع الطبيعي',
            'Tank Level Reading Delayed': 'تأخرت قراءة مستوى الخزان',
            'Flow Rate Outside Expected Range': 'معدل التدفق خارج النطاق المتوقع',
            'Backup Sensor Communication Lost': 'انقطع الاتصال بمستشعر الاحتياط',
            'Tank Level Critical': 'مستوى الخزان حرج'
        }
    }
} as const;

L10n.load({ ar: arabicLocale.ar });

const sensorData = sensorDataJson.map((item) => ({
    ...item,
    timestamp: new Date(item.timestamp)
}));
const alarmData = alarmDataJson.map((item) => ({
    ...item,
    timestamp: new Date(item.timestamp.replace(' ', 'T'))
}));

const latestReading = sensorData[sensorData.length - 1];
if (!latestReading) {
    throw new Error('The sensor sample dataset must contain at least one reading.');
}

const activeAlarmCount = alarmData.filter((alarm) => alarm.status === 'Active').length;
const alarmRecordCount = alarmData.length;
let language: Language = 'en-US';

const setSummaryValue = (id: string, value: string): void => {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Dashboard summary element #${id} was not found.`);
    }
    element.textContent = value;
};

const translateValue = (values: Readonly<Record<string, string>>, value: string): string =>
    values[value] ?? value;

const chart = new Chart({
    title: translations[language].chartTitle,
    primaryXAxis: {
        valueType: 'DateTime',
        title: translations[language].timestamp
    },
    primaryYAxis: {
        title: translations[language].level
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
            name: translations[language].tankLevel
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
            maximum: Math.max(alarmRecordCount, 1),
            startAngle: 210,
            endAngle: 150,
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

const grid = new Grid({
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
        { field: 'id', headerText: translations[language].columns[0], width: 100 },
        {
            field: 'timestamp',
            headerText: translations[language].columns[1],
            type: 'date',
            format: { type: 'dateTime', format: 'yMdHm' },
            width: 180
        },
        { field: 'severity', headerText: translations[language].columns[2], width: 120 },
        { field: 'status', headerText: translations[language].columns[3], width: 140 },
        { field: 'quality', headerText: translations[language].columns[4], width: 120 },
        { field: 'message', headerText: translations[language].columns[5], width: 250 }
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

const localizationDropdown = new DropDownList({
    dataSource: [
        { text: 'English', value: 'en-US' },
        { text: 'Arabic', value: 'ar' }
    ],
    fields: { text: 'text', value: 'value' },
    value: language,
    width: '150px',
    change: (args) => {
        if (args.value === 'en-US' || args.value === 'ar') {
            applyLanguage(args.value);
        }
    }
});
localizationDropdown.appendTo('#localizationDropdown');
applyLanguage(language);

function applyLanguage(selectedLanguage: Language): void {
    language = selectedLanguage;
    const isRtl = language === 'ar';
    const text = translations[language];

    setCulture(language);
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.title = `${text.title} | MicroGuard`;
    const descriptionMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!descriptionMeta) {
        throw new Error('The page description meta element was not found.');
    }
    descriptionMeta.content = text.description;

    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((element) => {
        const key = element.dataset.i18n as keyof typeof text;
        element.textContent = text[key] as string;
    });
    document.querySelectorAll<HTMLElement>('[data-i18n-aria-label]').forEach((element) => {
        const key = element.dataset.i18nAriaLabel as keyof typeof text;
        element.setAttribute('aria-label', text[key] as string);
    });

    const formattedLevel = new Intl.NumberFormat(language, {
        maximumFractionDigits: 0
    }).format(latestReading.value);
    setSummaryValue('latest-level', `${formattedLevel}%`);
    setSummaryValue('latest-quality', translateValue(text.quality, latestReading.quality));
    setSummaryValue(
        'latest-reading-time',
        `${text.latestSample}: ${latestReading.timestamp.toLocaleString(language)}`
    );
    setSummaryValue('active-alarm-count', new Intl.NumberFormat(language).format(activeAlarmCount));
    setSummaryValue('alarm-record-count', new Intl.NumberFormat(language).format(alarmRecordCount));

    chart.enableRtl = isRtl;
    chart.locale = language;
    chart.title = text.chartTitle;
    chart.primaryXAxis.title = text.timestamp;
    chart.primaryYAxis.title = text.level;
    chart.series[0].name = text.tankLevel;
    chart.refresh();

    grid.enableRtl = isRtl;
    grid.locale = language;
    grid.columns.forEach((column, index) => {
        if (typeof column !== 'string') {
            column.headerText = text.columns[index];
        }
    });
    grid.dataSource = alarmData.map((alarm) => ({
        ...alarm,
        severity: translateValue(text.severity, alarm.severity),
        status: translateValue(text.status, alarm.status),
        quality: translateValue(text.quality, alarm.quality),
        message: translateValue(text.messages, alarm.message)
    }));
    grid.refresh();

    linearGauge.locale = language;
    linearGauge.enableRtl = isRtl;
    linearGauge.axes[0].isInversed = isRtl;
    linearGauge.refresh();

    circularGauge.locale = language;
    circularGauge.enableRtl = isRtl;
    circularGauge.axes[0].direction = isRtl ? 'AntiClockWise' : 'ClockWise';
    circularGauge.refresh();

    localizationDropdown.locale = language;
    localizationDropdown.enableRtl = isRtl;
    localizationDropdown.dataBind();
}
