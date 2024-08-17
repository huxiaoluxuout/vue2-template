<template>
  <view :class="customClass" :style="resultCustomStyle">
    <view class="calendar">
      <view class="calendar_header" v-if="header">
        <view class="header_left" :style="{display:today?'inline-flex':'flex'}">
          <view class="header_preMonth" :class="!showPreYearBtn &&'hidden-btn'" @click="getLastYearDays">{{ '<<' }}</view>
          <view class="header_preMonth" :class="!showPreMonthBtn&&'hidden-btn'" @click="getPreMonthDays">{{ '<' }}</view>

          <view class="header_title">{{ currentDate }}</view>

          <view class="header_nextMonth" :class="!showNextMonthBtn&&'hidden-btn'" @click="getNextMonthDays">{{ '>' }}</view>
          <view class="header_preMonth" :class="!showNextYearBtn&&'hidden-btn'" @click="getNextYearDays">{{ '>>' }}</view>
        </view>
        <view class="header_right" v-if="today">
          <view @click="jumpToToady">今天</view>
        </view>
      </view>
      <view class="calendar_weeks" v-if="weeks">
        <template v-for="(item,index) in weekTitle" :key="index">
          <view class="weeks_item">{{ item }}</view>
        </template>
      </view>
      <scroll-view :scroll-y="true" class="scroll-Y" :enable-flex="true">
        <view style="height: 10rpx;"></view>
        <view class="calendar_days">
          <view class="calendar__month-mark">{{ bgMonth }}</view>
          <view class="days_grid " v-for="(day,index) in days" :key="index">
            <view v-if="day.day<=0" class="days_item" :class="[day.className,day.type]">{{ day.day }}</view>
            <template v-else>

              <view v-if="day.type === 'pre'" class="days_item" :class="[day.className,day.type]" @click="preSelectDay(day)">
                {{ day.day }}
              </view>


              <view v-else-if="day.type === 'current'" class="days_item" :class="[day.className,day.type]" @click="selectDay(day)">
                {{ day.day }}

              </view>
              <view v-else class="days_item" :class="[day.className,day.type]" @click="nextSelectDay(day)">{{ day.day }}</view>
            </template>
          </view>
        </view>
      </scroll-view>
      <button class="btn-confirm" :class="!hasDate&&'disable-btn'" @click="confirmBtn">确定</button>

    </view>
  </view>
</template>
<script>


import {componentsMixin, localStringStyle, ylxStyleObjectToString} from "@/components/ylx-components/ylx-JS/template";


export default {
  mixins: [componentsMixin],

  name: 'ylx-calendar',

  props: {
    /**
     * 是否显示头部操作栏
     */
    header: {
      type: Boolean,
      default: true
    },


    /**
     * 是否上个月按钮
     */
    preMonth: {
      type: Boolean,
      default: true
    },
    /**
     * 是否下个月按钮
     */
    nextMonth: {
      type: Boolean,
      default: true
    },
    /**
     * 是否上一年按钮
     */
    preYear: {
      type: Boolean,
      default: true,
    },
    /**
     * 是否下一年按钮
     */
    nextYear: {
      type: Boolean,
      default: true
    },
    /**
     * 是否显示今天按钮
     */
    today: {
      type: Boolean,
      default: false,
    },
    /**
     * 是否显示周标题
     */
    weeks: {
      type: Boolean,
      default: true,
    },

    /**
     * 是否显示前后月份残余数据
     */
    showMoreDays: {
      type: Boolean,
      default: false,
    },
    /**
     * 日期连接符
     */
    formatType: {
      type: String,
      default: '-',
    },

    activeDays: {
      type: Array,
      default: () => [],
    },
    showActiveDays: Boolean,

    startYear: {
      type: Number,
      default: 2000,
    },
    endYear: {
      type: Number,
      default: 2038,
    },
    startMonth: {
      type: Number,
      default: 1,
    },
    endMonth: {
      type: Number,
      default: 12,
    },


  },
  data() {
    return {
      weekTitle: ['日', '一', '二', '三', '四', '五', '六'],
      days: [],

      bgMonth: 1,
      currentDate: null,
      currentYear: 2024,
      currentMonth: 1,

      // startYear: 1970,
      // endYear: 2038,

      // startMonth: 1,
      // endMonth: 12,

    }
  },
  computed: {
    resultCustomStyle() {
      return ylxStyleObjectToString({
        height: '100%'
      }) + localStringStyle(this.customStyle)
    },

    sectionMonths() {
      return this.startYear === this.endYear
    },
    showPreYearBtn() {
      return this.currentYear > this.startYear
    },

    showNextYearBtn() {
      return this.currentYear < this.endYear
    },

    showPreMonthBtn() {
      if (this.sectionMonths) {
        return this.startMonth < this.currentMonth
      } else {
        return !(this.startYear === this.currentYear && this.currentMonth === 1)
      }

    },
    showNextMonthBtn() {
      if (this.sectionMonths) {
        return this.endMonth > this.currentMonth
      } else {
        return !(this.endYear === this.currentYear && this.currentMonth === 12)
      }
    },
    // 有选中日期
    hasDate() {
      return this.days.some(item => item.className.indexOf('current-day select-day') !== -1)
    },
  },
  watch: {
    currentYear() {
      this.updateViewData()
    },
    currentMonth() {
      this.updateViewData()
    },


  },

  methods: {

    init() {

      this.jumpToToady()
    },

    // 获取某年某月总共多少天
    getMonthAllDays(year, month) {
      return new Date(year, month, 0).getDate();
    },

    //获取当月天数
    getCurrentDays(year, month) {
      let currentDays = []
      this.currentDaysLen = this.getMonthAllDays(year, month)
      if (currentDays <= 0) {
        for (let i = 1; i <= this.currentDaysLen; i++) {
          currentDays.push({
            type: 'current',
            year,
            month,
            day: i,
            className: '',
          })
        }

      }
      return currentDays
    },

    // 获取上月残余天数
    getPreDays(year, month) {
      //上月残余天数
      let preMonth = month - 1
      this.emptyDaysLen = this.getFirstDayWeek(new Date(year, month, 0))
      //上月天数
      this.preDaysLen = preMonth < 0 ?
          this.getMonthAllDays(year, -1, 12) :
          this.getMonthAllDays(year, preMonth);

      let preMonthDays = []
      for (let i = 1; i <= this.emptyDaysLen; i++) {
        //是否显示上月残余天数
        if (this.showMoreDays) {
          preMonthDays.unshift({
            type: 'pre',
            year,
            preMonth,
            day: this.preDaysLen,
            className: ''
          })
          this.preDaysLen--
        } else {
          preMonthDays.unshift({
            type: 'pre',
            year,
            preMonth,
            day: '',
            className: ''
          })
        }

      }
      return preMonthDays
    },

    // 获取下月残余天数
    getNextDays(year, month) {
      let nextMonth = month + 1
      let nextMonthDaysLen = (42 - this.emptyDaysLen - this.currentDaysLen - 7) >= 0 ?
          (42 - this.emptyDaysLen - this.currentDaysLen - 7) : (42 - this.emptyDaysLen - this.currentDaysLen) // 下月多余天数
      let nextMonthDays = []
      if (nextMonthDaysLen > 0) {
        for (let i = 1; i <= nextMonthDaysLen; i++) {
          if (this.showMoreDays) {
            nextMonthDays.push({
              type: 'next',
              year,
              nextMonth,
              day: i,
              className: ''
            })
          } else {
            nextMonthDays.push({
              type: 'next',
              year,
              nextMonth,
              day: '',
              className: ''
            })
          }
        }
      }
      return nextMonthDays
    },


    //当月显示数据 包括上月 下月残余数据
    getAllDays(year, month) {
      let preDays = this.getPreDays(year, month)
      let currentDays = this.getCurrentDays(year, month)
      let nextDays = this.getNextDays(year, month)
      this.days = [...preDays, ...currentDays, ...nextDays]
      this.bgMonth = month

    },
    setCurrentDate(year, month, day) {
      console.log({year, month, day})
      let daysInMonth;
      if (month === 2) {
        daysInMonth = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 29 : 28;
      } else if ([4, 6, 9, 11].includes(month)) {
        daysInMonth = 30;
      } else {
        daysInMonth = 31;
      }

      let currentDay = day
      if (day >= daysInMonth) {
        currentDay = daysInMonth
      } else {
        currentDay = day
      }

      let date = this.formatDateJoinStr(year, month, currentDay)

      this.currentYear = year
      this.currentMonth = month
      this.currentDay = currentDay
      this.currentDate = date

    },
    // 设置选中日期的样式 默认选中当前日期
    setSelectedDayClass(selectedYear = new Date().getFullYear(), selectedMonth = new Date().getMonth() + 1, selectedDay = new Date().getDate()) {
      const hasActiveDays = this.showActiveDays > 0;

      this.days = this.days.map(item => {
        const isActiveDay = this.activeDays.includes(item.day);
        const isCurrentDate = item.year === selectedYear && item.month === selectedMonth && item.day === selectedDay;

        let className = '';

        if (hasActiveDays) {
          // 如果有激活的日期
          if (!isActiveDay) {
            className = 'day--disabled';
          } else if (isCurrentDate) {
            className = 'current-day select-day';
          } else if (item.day === selectedDay) {
            className = 'current-day';
          }
        } else {
          // 如果没有激活的日期
          if (isActiveDay) {
            className = 'day--disabled';
          } else if (isCurrentDate) {
            className = 'current-day select-day';
          } else if (item.day === selectedDay) {
            className = 'current-day';
          }
        }

        return {...item, className};
      })

    },

    updateViewData() {
      // console.log('updateViewData')
      this.$nextTick(() => {
        this.getAllDays(this.currentYear, this.currentMonth)
        this.setCurrentDate(this.currentYear, this.currentMonth, this.currentDay)
        this.setSelectedDayClass(this.selectedYear, this.selectedMonth, this.selectedDay)
      })
    },


    //上个月
    getPreMonthDays() {
      if (!this.sectionMonths) {
        if (this.currentMonth === 1 && this.startYear <= this.currentYear) {
          this.currentMonth = 12;
          this.currentYear -= 1;
        } else {
          this.currentMonth -= 1;
        }
      } else {
        this.currentMonth -= 1
      }

      this.$emit('preMonth', this.formatDateJoinStr(this.currentYear, this.currentMonth, this.currentDay));
    },


    //下个月
    getNextMonthDays() {

      if (!this.sectionMonths) {
        if (this.currentMonth === 12 && this.currentYear <= this.endYear) {
          this.currentMonth = 1;
          this.currentYear += 1;
        } else {
          this.currentMonth += 1;
        }
      } else {
        this.currentMonth += 1
      }

      this.$emit('nextMonth', this.formatDateJoinStr(this.currentYear, this.currentMonth, this.currentDay));

    },

    //上一年
    getLastYearDays() {
      this.currentYear = this.currentYear - 1
      this.updateViewData()

      this.$emit('preYear', this.formatDateJoinStr(this.currentYear, this.currentMonth, this.currentDay));
    },

    //下一年
    getNextYearDays() {
      this.currentYear = this.currentYear + 1
      this.updateViewData()

      this.$emit('nextYear', this.formatDateJoinStr(this.currentYear, this.currentMonth, this.currentDay));
    },

    //今天
    jumpToToady() {
      let currentDate = new Date()
      this.currentYear = currentDate.getFullYear()
      this.currentMonth = currentDate.getMonth() + 1
      this.currentDay = currentDate.getDate()

      this.selectedYear = this.currentYear
      this.selectedMonth = this.currentMonth
      this.selectedDay = this.currentDay
      this.currentDate = this.formatDateJoinStr(this.currentYear, this.currentMonth, this.currentDay)

      this.$emit('jumpToToady', this.formatDateJoinStr(this.currentYear, this.currentMonth, this.currentDay));


    },

    preSelectDay(itemDay) {
      if (!this.showMoreDays) return
      this.getPreMonthDays()
      this.selectDay({
        ...itemDay,
        className: 'elect-day',
        type: 'current',
        month: itemDay.preMonth,
      })
    },
    nextSelectDay(itemDay) {
      if (!this.showMoreDays) return

      this.getNextMonthDays()
      this.selectDay({
        ...itemDay,
        className: 'elect-day',
        type: 'current',
        month: itemDay.nextMonth,
      })
    },
    //选择日期
    selectDay(itemDay) {
      if (itemDay.className.indexOf('day--disabled') !== -1) {
        this.$emit('disabledSelect', {});
        return
      }

      this.selectedYear = itemDay.year
      this.selectedMonth = itemDay.month
      this.selectedDay = itemDay.day

      this.currentYear = itemDay.year
      this.currentMonth = itemDay.month
      this.currentDay = itemDay.day

      this.updateViewData()

      this.$emit('selectDay', {value: this.currentDate});

    },

    // 确定
    confirmBtn() {

      this.$emit('confirm', {
        currentYear: this.currentYear,
        currentMonth: this.currentMonth,
        currentDay: this.currentDay,
        currentDate: this.currentDate,
      });
    },


    //日期格式化
    formatDateJoinStr(year, month, day) {
      return [year, month, day].map(this.formatNumber).join(this.formatType)
    },


    //补零
    formatNumber(n) {
      n = n.toString()
      return n[1] ? n : '0' + n
    },

    //星期格式化
    formatWeek(day, week) {
      let result = week - (day % 7 - 1);
      let currentWeek = result < 0 ? 7 + result : result;
      return currentWeek;
    },

    //获取当月1号为星期几
    getFirstDayWeek(date) {
      let day = date.getDate() //获取当前日
      let week = date.getDay() //获取当前星期几
      return this.formatWeek(day, week)
    }
  }

}
</script>
<style scoped>
.calendar {
  width: 100%;
  text-align: center;
  font-size: 30rpx;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%
}

.calendar_header {
  line-height: 70rpx;
  font-size: 30rpx;
  text-align: left;
  padding: 0 20rpx;
  box-sizing: border-box;
}

.header_left {
  flex: 1;
  justify-content: space-between;
  align-items: center;

}

.header_left .header_preMonth,
.header_nextMonth {
  min-width: 50rpx;
  text-align: center;
}

.header_right {
  flex: 1;
  text-align: right;
  padding: 0 20px;
  display: inline-block;
  float: right;
}

.header_title {
  min-width: 300rpx;
  text-align: center;
}

.calendar_weeks {
  display: flex;
  text-align: center;
  padding: 20rpx 10rpx;
  box-sizing: border-box;
  border-bottom: 1rpx solid #e0e0e0;

}

.weeks_item {
  flex: 1;
}

.scroll-Y {
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: auto;
}

.calendar_days {
  display: flex;
  flex-wrap: wrap;
  box-sizing: border-box;
  margin: 0 10rpx;

  position: relative;
  flex: 1;


}


.days_grid {
  width: 14.28571428571429%;
  line-height: 100rpx;
  position: relative;
  z-index: 1;
}

.days_grid .pre, .next {
  color: #c8c9cc;
}

.days_item {
  border: 1px solid transparent;
}

.current-day {
  border-radius: 8px;
  border: 1px solid #c8c9cc;
}

.select-day {
  opacity: 1;
  background: #2EBFF5;
  border: 1px solid #2EBFF5;
  border-radius: 8px;
  color: #fff;
  margin: 0 auto;
}


.day--disabled {
  color: #c8c9cc;
}

.calendar__month-mark {
  color: rgba(242, 243, 245, .8);
  font-size: 160px;
  left: 50%;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
}

.hidden-btn {
  opacity: 0;
  pointer-events: none;
}

.btn-confirm {
  color: #fff;
  background: #2EBFF5;
  border-color: #2EBFF5;
  border-radius: 100px;
  width: 86%;
  line-height: 2.2;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}

.btn-confirm:after {
  border: none;
}

.disable-btn {
  opacity: .4;
  pointer-events: none;
}


</style>
