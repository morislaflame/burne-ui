export type CalendarLocale = {
  /** 7 items: Mon → Sun */
  weekDays: string[];
  /** 12 full month names */
  months: string[];
  /** 12 abbreviated month names */
  monthsShort: string[];
  today: string;
  clear: string;
};

export const RU_LOCALE: CalendarLocale = {
  weekDays: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  months: [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
  ],
  monthsShort: [
    "Янв", "Фев", "Мар", "Апр", "Май", "Июн",
    "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек",
  ],
  today: "Сегодня",
  clear: "Очистить",
};
