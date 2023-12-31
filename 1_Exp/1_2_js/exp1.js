test_mode = false
var subject_id

const jsPsych = initJsPsych({
  /* auto_update_progress_bar: true,
   extensions: {
     type: naodao,
   }*/
  on_finish: function () {
    test_mode ? jsPsych.data.displayData() : jsPsych.data.get().localSave('csv', `exp1_${SUBJ_INFO["ID"] ? SUBJ_INFO["ID"] : subject_id}.csv`);
    // 退出全屏
    if (document.fullscreenElement) { // 检查是否处于全屏状态
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
    }
  }
});

const save_data = {
  type: jsPsychPipe,
  action: "save",
  experiment_id: "8z5IJf9UcgxA",
  filename: () => {
    subject_id = SUBJ_INFO["ID"] ? SUBJ_INFO["ID"] : Math.random().toFixed(4) * 10000;
    const filename = `exp1_${subject_id}.csv`;
    console.log('upload filename', filename)
    return filename;
  },
  data_string: () => jsPsych.data.get().csv()
};


var key = ['f', 'j']//按键
//正确率85%
const prac_acc_thres = 85;

const stim_starts = [1000, 1150]// the previous is for target the last one is for test
const stim_ends = [1050, 1200]

const tb_repetitions = test_mode ? 1 : 5;   // 此处填入试次的重复次数 5, 测试为 1
blockTotalNum1 = test_mode ? 3 : 6;         // 此处填入总block数量 6, 测试为 3

/**----------------------
 *    定义指导语
 *------------------------**/

let block_type = ["先图形后文字", "先文字后图形"]
block_type = jsPsych.randomization.shuffle(block_type)
console.log('block_type', block_type)

let time_consumption = 40
let add_pages1 = () => [
  `<p style='color:white; font-size: 25px; line-height: 30px;'>您将首先完成两组不同的刺激呈现顺序：<span style="color: yellow; ">先图形后文字、先文字后图形呈现</span>混合条件下，每24次按键的匹配任务练习。</p><p style='color:white; font-size: 25px; line-height: 30px;'>完成匹配任务的练习之后，您将完成每个条件下6组匹配任务，每组包括120次按键反应，每组完成后会有一分钟左右的休息时间。</p><p style='color:white; font-size: 22px; line-height: 25px;'>完成一组任务大约需要7分钟，整个实验将持续大约${time_consumption}分钟。</p>`,
  `<p class='footer'  style = 'font-size: 25px'>如果对本实验还有不清楚之处，请立即向实验员咨询。</p>
  <p style = 'font-size: 25px; line-height: 30px;'>如果您明白了规则：请点击 继续 进入练习</p><div>`
];
// 在指导语呈现前对刺激进行随机排序
let on_load_callback1 = () => {
  (() => {
    shuffle_stim(SUBJ_INFO["ID"])
  })()
}
let instructions1 = Instructions1_generator(
  time_consumption,
  add_pages1,
  on_load_callback1
)

/**--------------------------------------------
 *               定义刺激
 *---------------------------------------------**/

var texts = ["自我", "朋友", "他人"]//储存文字
let target_list = ["Image", "Word"]
const preload = {
  type: jsPsychPreload,
  images: images,
};
timeline.push(preload);//preload图片

let tb = [];
let stim_matrix_generator = () => {
  target_list.forEach((tar) => {
    texts.forEach(((text, ind_t) => {
      images.forEach((image, ind_i) => {
        let Matchness = ind_t == ind_i

        let stim_dict = {
          image: ind_i,
          word: ind_t,
          target: tar,
          image_start: tar == "Image" ? stim_starts[0] : stim_starts[1],
          image_end: tar == "Image" ? stim_ends[0] : stim_ends[1],
          word_start: tar == "Word" ? stim_starts[0] : stim_starts[1],
          word_end: tar == "Word" ? stim_ends[0] : stim_ends[1],
          matchness: Matchness ? "Match" : "Mismatch"
        }

        tb.push(stim_dict)
        if (Matchness) tb.push(stim_dict)
      })
    }))
  })
};
stim_matrix_generator()
// 通过 datapip 来生成实验条件
// setTimeout(async () => {
//   CONDITION_ID = await jsPsychPipe.getCondition("8z5IJf9UcgxA");
//   console.log('CONDITION_ID', CONDITION_ID)
//   shuffle_stim(CONDITION_ID)
// }, 1000)

/**--------------------------------------------
 *               定义练习阶段
 *---------------------------------------------**/

let trials_generator = (repetitions = 1, practice = true) => {

  // 定义 fixation 图片和文字呈现
  let timeline = [
    {
      type: jsPsychPsychophysics,
      stimuli: [
        fixation(),
        {
          obj_type: "image",
          file: () => images[jsPsych.timelineVariable("image")],
          startX: "center", // location of the cross's center in the canvas
          startY: "center",
          width: 190,  // 调整图片大小 视角：3.8° x 3.8°
          heigth: 190, // 调整图片大小 视角：3.8° x 3.8°
          show_start_time: jsPsych.timelineVariable("image_start"), // ms after the start of the trial
          show_end_time: jsPsych.timelineVariable("image_end"),//出现50ms
          origin_center: true//待确定
        },//上一组end时间减去下一组show时间就是空屏的100ms
        {
          obj_type: 'text',
          startX: "center",
          startY: "center", //图形和文字距离 与加号等距
          content: () => texts[jsPsych.timelineVariable('word')],
          font: `${80}px 'Arial'`, //字体和颜色设置 文字视角：3.6° x 1.6°
          text_color: 'white',
          show_start_time: jsPsych.timelineVariable("word_start"), // ms after the start of the trial
          show_end_time: jsPsych.timelineVariable("word_end"),//直到反应才消失刺激
          origin_center: true//带确定
        }
      ],
      choices: ['f', 'j'],
      response_start_time: 1150, //! 开始作答时间，第二个刺激呈现开始计算
      trial_duration: 2700,      //结束时间，一共作答时间持续1550ms
      on_finish: function (data) {
        data.image = images[jsPsych.timelineVariable("image")];
        data.word = texts[jsPsych.timelineVariable("word")];
        data.target = jsPsych.timelineVariable("target");
        // data.test = jsPsych.timelineVariable("test");
        // data.image_start = jsPsych.timelineVariable("image_start");
        // data.word_start = jsPsych.timelineVariable("word_start");
        data.valence = texts[jsPsych.timelineVariable("image")];
        data.matchness = jsPsych.timelineVariable("matchness");
        data.correct_response = data.matchness == "Match" ? key[0] : key[1];
        data.correct = data.correct_response == data.response;//0错1对
        // console.log('correct_response', data.matchness, data.correct_response, data.response, data.correct)
        data.exp_condition = practice ? "Practice" : "Formal"
      }
    }]

  // 练习加入反馈
  if (practice) timeline.push(
    {
      data: {
        exp_condition: "feedback"
      },
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function () {

        let last_data = jsPsych.data.get().last(1).values()[0]
        // console.log('last_data', last_data)

        let time = last_data.rt;
        if (time > 1500 || time === null) { //大于1500或为null为过慢
          return "<span class='add_' style='color:yellow; font-size: 70px;'> 太慢! </span>"
        } else if (time < 200) { //小于两百为过快反应
          return "<span style='color:yellow; font-size: 70px;'>过快! </span>"
        } else {
          if (last_data.correct == 1) { //如果按键 == 正确按键
            return "<span style='color:GreenYellow; font-size: 70px;'>正确! </span>"
          }
          else {
            return "<span style='color:red; font-size: 70px;'>错误! </span>"
          }
        }
      },
      choices: "NO_KEYS",
      trial_duration: 300,//300ms反馈
    })

  return {
    timeline: timeline,
    timeline_variables: tb,
    randomize_order: true,
    repetitions: repetitions
  };
}

var feedback_p = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    let trials = jsPsych.data.get().filter(
      [{ correct: true }, { correct: false }]
    ).last(tb.length); // 运行逻辑：先挑出data里的所有的correct：true/false的数据行，成为新的数组，然后对倒数的某几组进行计算
    //这里填入timeline_variables里面的trial数量
    let correct_trials = trials.filter({
      correct: true
    });
    let accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    let rt = Math.round(correct_trials.select('rt').mean());
    return "<style>.context{color:white; font-size: 35px; line-height:40px}</style>\
                        <div><p class='context'>您正确回答了" + accuracy + "% 的试次。</p>" +
      "<p class='context'>您的平均反应时为" + rt + "毫秒。</p>" +
      "<p> <div style = 'color: green'><按空格键至下页></div></p>";
  },
  choices: [' ']
};
var if_node = { //if_node 用于判断是否呈现feedback，feedback_continue_practice
  timeline: [feedback_p, feedback_continue_practice],
  conditional_function: function (data) {
    var trials = jsPsych.data.get().filter(
      [{ correct: true }, { correct: false }]
    ).last(tb.length);//这里注意：只需要上一组的练习数据，而不是所有的数据！！ 如何实现：.last() 取data最后的几组数据（上一组练习数据）
    var correct_trials = trials.filter({
      correct: true
    });
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    if (accuracy >= prac_acc_thres) {
      return false;//达标就skip掉feedback_continue_practice这一段
    } else if (accuracy < prac_acc_thres) { //没达标反馈feedback,feedback_continue_practice
      return true;
    }
  }
};
var loop_node = {
  timeline: [trials_generator(), if_node],
  loop_function: function () {
    var trials = jsPsych.data.get().filter(
      [{ correct: true }, { correct: false }]
    ).last(tb.length);
    var correct_trials = trials.filter({
      correct: true
    });
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    if (accuracy >= prac_acc_thres) return false;
    else if (accuracy < prac_acc_thres) return true;
  }
};

/**--------------------------------------------
 *               定义正式实验
 *---------------------------------------------**/
let formal_trials = trials_generator(tb_repetitions, practice = false)
var feedback_f = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    let trials = jsPsych.data.get().filter(
      [{ correct: true }, { correct: false }]
    ).last(tb.length * tb_repetitions); // 运行逻辑：先挑出data里的所有的correct：true/false的数据行，成为新的数组，然后对倒数的某几组进行计算
    //这里填入timeline_variables里面的trial数量
    let correct_trials = trials.filter({
      correct: true
    });
    let accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    let rt = Math.round(correct_trials.select('rt').mean());
    return "<style>.context{color:white; font-size: 35px; line-height:40px}</style>\
                        <div><p class='context'>您正确回答了" + accuracy + "% 的试次。</p>" +
      "<p class='context'>您的平均反应时为" + rt + "毫秒。</p>" +
      "<p> <div style = 'color: green'><按任意键进入休息></div></p>";
  }
};
var repeatblock = {
  timeline: [formal_trials, feedback_f, rest1],
  repetitions: blockTotalNum1 //6个block
};

/**--------------------------------------------
 *               定义总的 timeline
 *---------------------------------------------**/

if (!test_mode) {
  timeline.push(welcome);
  timeline.push(basic_info_instru_generator());
  timeline.push(chinrest);
  timeline.push(fullscreen_trial);
}
timeline.push(instructions1);
timeline.push(count_down());
timeline.push(loop_node);
timeline.push(feedback_goformal);
timeline.push(repeatblock);
timeline.push(feedback_final)
if (!test_mode) timeline.push(finish());
timeline.push(save_data);

jsPsych.run(timeline);