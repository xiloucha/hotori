import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface CbtRecord {
  id: number;
  date: string;
  title: string;
  answers: string[];
  completed: boolean;
}

type Language = 'ja' | 'en' | 'zh';

type Screen =
  | 'home'
  | 'session'
  | 'list'
  | 'review'
  | 'records'
  | 'calendar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  language: Language = 'ja';
  screen: Screen = 'home';

  currentQuestion = 0;

  answers: string[] = ['', '', '', '', '', ''];

  records: CbtRecord[] = [];

  recordTitle = '';
  editingRecordId: number | null = null;
  deleteTargetId: number | null = null;

  returnScreen: 'records' | 'calendar' = 'records';

  calendarYear = new Date().getFullYear();
  calendarMonth = new Date().getMonth();

  selectedDateKey: string | null = null;

  private readonly storageKey = 'hotori-records';

  readonly questions = {
    ja: [
      '何が起こりましたか？',
      'そのとき、どんな気持ちでしたか？',
      'そのとき、どんな考えが浮かびましたか？',
      'そう考えた理由や根拠は、何でしょう？',
      '別の見方をすると、どう考えられますか？',
      '今は、どんな気持ちですか？'
    ],
    en: [
      'What happened?',
      'How did you feel at that moment?',
      'What thought came to your mind at that moment?',
      'What reasons or evidence support that thought?',
      'Is there another way to look at it?',
      'How do you feel now?'
    ],
    zh: [
      '发生了什么？',
      '当时你有什么感受？',
      '当时你脑中浮现了什么想法？',
      '为什么会这样想？有什么理由或依据？',
      '换一个角度来看，可以怎么想？',
      '现在有什么感受？'
    ]
  };

  readonly translations = {
    ja: {
      subtitle: 'CBTのためのメモ帳',
      start: 'はじめる',
      next: '次へ',
      back: '戻る',
      list: '一覧',
      save: '保存',
      discard: '破棄',
      review: '振り返る',
      records: '記録',
      calendar: 'カレンダー',
      language: 'LANGUAGE',
      completed: '完成',
      unfinished: '未完成',
      continue: '続きから',
      noRecords: 'まだ記録はありません。',
      empty: 'まだ回答はありません。',
      confirmDiscard: 'この記録を破棄しますか？',
      confirmDelete: 'この記録を削除しますか？',
      yes: 'はい',
      no: 'いいえ',
      today: '今日',
      close: '閉じる',
      selectRecord: 'この日の記録',
      recordNumber: '記録',
      title: 'タイトル',
      titlePlaceholder: 'タイトルをつける（任意）',
      untitled: '無題の記録',
      aboutTitle: 'HOTORIについて',
aboutText: 'HOTORIは、あなたのためのメモ帳です。入力した内容はこの端末に保存され、外部へ送信されません。アカウントも、AIも、広告もありません。',
    },

    en: {
      subtitle: 'A notebook for CBT',
      start: 'START',
      next: 'NEXT',
      back: 'BACK',
      list: 'LIST',
      save: 'SAVE',
      discard: 'DISCARD',
      review: 'REVIEW',
      records: 'RECORDS',
      calendar: 'CALENDAR',
      language: 'LANGUAGE',
      completed: 'Complete',
      unfinished: 'Incomplete',
      continue: 'CONTINUE',
      noRecords: 'No records yet.',
      empty: 'No answer yet.',
      confirmDiscard: 'Discard this record?',
      confirmDelete: 'Delete this record?',
      yes: 'YES',
      no: 'NO',
      today: 'Today',
      close: 'CLOSE',
      selectRecord: 'Records for this day',
      recordNumber: 'Record',
      title: 'TITLE',
      titlePlaceholder: 'Add a title (optional)',
      untitled: 'Untitled record',
      aboutTitle: 'ABOUT HOTORI',
aboutText: 'HOTORI is a notebook for you. What you write is stored on this device and is not sent anywhere. No account, no AI, no ads.',
    },

    zh: {
      subtitle: '用于CBT的笔记本',
      start: '开始',
      next: '下一步',
      back: '返回',
      list: '列表',
      save: '保存',
      discard: '放弃',
      review: '回顾',
      records: '记录',
      calendar: '日历',
      language: 'LANGUAGE',
      completed: '完成',
      unfinished: '未完成',
      continue: '继续',
      noRecords: '还没有记录。',
      empty: '还没有回答。',
      confirmDiscard: '要放弃这条记录吗？',
      confirmDelete: '要删除这条记录吗？',
      yes: '是',
      no: '否',
      today: '今天',
      close: '关闭',
      selectRecord: '当天的记录',
      recordNumber: '记录',
      title: '标题',
      titlePlaceholder: '添加标题（可选）',
      untitled: '无标题记录',
      aboutTitle: '关于 HOTORI',
aboutText: 'HOTORI 是一本属于你的笔记本。你输入的内容只会保存在这台设备上，不会发送到外部。无需账号，没有 AI，也没有广告。',
    }
  };

  get q() {
    return this.questions[this.language];
  }

  get t() {
    return this.translations[this.language];
  }

  constructor() {
    this.loadRecords();
  }

  setLanguage(language: Language) {
    this.language = language;
  }

  startSession() {
    this.answers = ['', '', '', '', '', ''];
    this.recordTitle = '';
    this.currentQuestion = 0;
    this.editingRecordId = null;
    this.returnScreen = 'records';
    this.screen = 'session';
  }

  nextQuestion() {
    if (this.currentQuestion < this.q.length - 1) {
      this.currentQuestion++;
    } else {
      this.screen = 'review';
    }
  }

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
    }
  }

  backToSession() {
    this.screen = 'session';
  }

  openSessionList() {
    this.screen = 'list';
  }

  saveSession() {
    const completed = this.answers.every(
      answer => answer.trim().length > 0
    );

    const title = this.recordTitle.trim();

    if (this.editingRecordId !== null) {
      const index = this.records.findIndex(
        record => record.id === this.editingRecordId
      );

      if (index !== -1) {
        this.records[index] = {
          ...this.records[index],
          title,
          answers: [...this.answers],
          completed
        };
      }
    } else {
      const newRecord: CbtRecord = {
        id: Date.now(),

        // UTCではなく、日本など現在端末のローカル時間で保存
        date: this.localDateTime(),

        title,
        answers: [...this.answers],
        completed
      };

      this.records.unshift(newRecord);
    }

    this.saveRecords();

    this.screen = this.returnScreen;
    this.editingRecordId = null;
    this.recordTitle = '';
  }

  discardSession() {
    if (window.confirm(this.t.confirmDiscard)) {
      this.answers = ['', '', '', '', '', ''];
      this.recordTitle = '';
      this.currentQuestion = 0;
      this.editingRecordId = null;
      this.screen = 'home';
    }
  }

  goRecords() {
    if (
      this.screen === 'session' ||
      this.screen === 'list' ||
      this.screen === 'review'
    ) {
      return;
    }

    this.screen = 'records';
  }

  openRecord(
    record: CbtRecord,
    from: 'records' | 'calendar' = 'records'
  ) {
    this.answers = [...record.answers];
    this.recordTitle = record.title ?? '';
    this.editingRecordId = record.id;
    this.returnScreen = from;

    const firstEmpty = this.answers.findIndex(
      answer => answer.trim().length === 0
    );

    if (firstEmpty !== -1) {
      this.currentQuestion = firstEmpty;
    } else {
      this.currentQuestion = this.q.length - 1;
    }

    this.screen = 'session';
  }

  openDeleteConfirm(id: number) {
    this.deleteTargetId = id;
  }

  cancelDelete() {
    this.deleteTargetId = null;
  }

  confirmDelete() {
    if (this.deleteTargetId === null) {
      return;
    }

    this.records = this.records.filter(
      record => record.id !== this.deleteTargetId
    );

    this.saveRecords();
    this.deleteTargetId = null;
  }

  goCalendar() {
    if (
      this.screen === 'session' ||
      this.screen === 'list' ||
      this.screen === 'review'
    ) {
      return;
    }

    this.screen = 'calendar';
  }

  previousMonth() {
    if (this.calendarMonth === 0) {
      this.calendarMonth = 11;
      this.calendarYear--;
    } else {
      this.calendarMonth--;
    }
  }

  nextMonth() {
    if (this.calendarMonth === 11) {
      this.calendarMonth = 0;
      this.calendarYear++;
    } else {
      this.calendarMonth++;
    }
  }

  goToday() {
    const today = new Date();

    this.calendarYear = today.getFullYear();
    this.calendarMonth = today.getMonth();
  }

  get calendarTitle(): string {
    if (this.language === 'ja' || this.language === 'zh') {
      return `${this.calendarYear}年 ${this.calendarMonth + 1}月`;
    }

    const date = new Date(
      this.calendarYear,
      this.calendarMonth,
      1
    );

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  }

  get weekDays(): string[] {
    if (this.language === 'ja') {
      return ['月', '火', '水', '木', '金', '土', '日'];
    }

    if (this.language === 'zh') {
      return ['一', '二', '三', '四', '五', '六', '日'];
    }

    return ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  }

  get calendarDays() {
    const firstDay = new Date(
      this.calendarYear,
      this.calendarMonth,
      1
    );

    const lastDay = new Date(
      this.calendarYear,
      this.calendarMonth + 1,
      0
    );

    const firstWeekday =
      (firstDay.getDay() + 6) % 7;

    const days: {
      date: number;
      currentMonth: boolean;
      fullDate: string;
      records: CbtRecord[];
    }[] = [];

    const previousMonthLastDay =
      new Date(
        this.calendarYear,
        this.calendarMonth,
        0
      ).getDate();

    for (let i = firstWeekday - 1; i >= 0; i--) {
      const date = previousMonthLastDay - i;

      const fullDate = this.dateKey(
        this.calendarYear,
        this.calendarMonth - 1,
        date
      );

      days.push({
        date,
        currentMonth: false,
        fullDate,
        records: this.recordsForDate(fullDate)
      });
    }

    for (
      let date = 1;
      date <= lastDay.getDate();
      date++
    ) {
      const fullDate = this.dateKey(
        this.calendarYear,
        this.calendarMonth,
        date
      );

      days.push({
        date,
        currentMonth: true,
        fullDate,
        records: this.recordsForDate(fullDate)
      });
    }

    let nextDate = 1;

    while (days.length < 42) {
      const fullDate = this.dateKey(
        this.calendarYear,
        this.calendarMonth + 1,
        nextDate
      );

      days.push({
        date: nextDate,
        currentMonth: false,
        fullDate,
        records: this.recordsForDate(fullDate)
      });

      nextDate++;
    }

    return days;
  }

  dateKey(
    year: number,
    month: number,
    date: number
  ): string {
    const d = new Date(year, month, date);

    const y = d.getFullYear();
    const m = String(
      d.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      d.getDate()
    ).padStart(2, '0');

    return `${y}-${m}-${day}`;
  }

  recordsForDate(
    dateKey: string
  ): CbtRecord[] {
    return this.records.filter(
      record => record.date.slice(0, 10) === dateKey
    );
  }

  isToday(dateKey: string): boolean {
    const today = new Date();

    return (
      dateKey ===
      this.dateKey(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      )
    );
  }

  selectCalendarDate(dateKey: string) {
    const dayRecords =
      this.recordsForDate(dateKey);

    if (dayRecords.length === 0) {
      return;
    }

    this.selectedDateKey = dateKey;
  }

  closeDateSelection() {
    this.selectedDateKey = null;
  }

  get selectedDateRecords(): CbtRecord[] {
    if (!this.selectedDateKey) {
      return [];
    }

    return this.recordsForDate(
      this.selectedDateKey
    );
  }

  get selectedDateLabel(): string {
    if (!this.selectedDateKey) {
      return '';
    }

    return this.formatDateKey(
      this.selectedDateKey
    );
  }

  openCalendarRecord(record: CbtRecord) {
    this.closeDateSelection();
    this.openRecord(record, 'calendar');
  }

  formatDateKey(dateKey: string): string {
    const d = new Date(
      `${dateKey}T00:00:00`
    );

    if (this.language === 'en') {
      return d.toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
      );
    }

    if (this.language === 'zh') {
      return d.toLocaleDateString(
        'zh-CN',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
      );
    }

    return d.toLocaleDateString(
      'ja-JP',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    );
  }

  getSessionAnswers() {
    return this.q.map(
      (question, index) => ({
        question,
        answer: this.answers[index]
      })
    );
  }

  formatDate(date: string): string {
    const d = new Date(date);

    if (this.language === 'en') {
      return d.toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }
      );
    }

    if (this.language === 'zh') {
      return d.toLocaleDateString(
        'zh-CN',
        {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }
      );
    }

    return d.toLocaleDateString(
      'ja-JP',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    );
  }

  goHome() {
    this.screen = 'home';
  }

  /**
   * 現在の端末のローカル時間を保存する。
   *
   * toISOString() はUTCに変換してしまうため、
   * 日本時間の深夜などでは日付が前日にずれる。
   */
  private localDateTime(): string {
    const now = new Date();

    const y = now.getFullYear();

    const m = String(
      now.getMonth() + 1
    ).padStart(2, '0');

    const d = String(
      now.getDate()
    ).padStart(2, '0');

    const hh = String(
      now.getHours()
    ).padStart(2, '0');

    const mm = String(
      now.getMinutes()
    ).padStart(2, '0');

    const ss = String(
      now.getSeconds()
    ).padStart(2, '0');

    return `${y}-${m}-${d}T${hh}:${mm}:${ss}`;
  }

  private loadRecords() {
    const saved =
      localStorage.getItem(
        this.storageKey
      );

    if (!saved) {
      return;
    }

    try {
      const parsed = JSON.parse(saved);

      this.records = parsed.map(
        (record: CbtRecord) => ({
          ...record,
          title: record.title ?? ''
        })
      );
    } catch {
      this.records = [];
    }
  }

  private saveRecords() {
    localStorage.setItem(
      this.storageKey,
      JSON.stringify(this.records)
    );
  }
}