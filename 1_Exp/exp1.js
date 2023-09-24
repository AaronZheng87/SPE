test_model = false

const jsPsych = initJsPsych({
  /* auto_update_progress_bar: true,
   extensions: {
     type: naodao,
   }*/
  on_finish: function () {
    test_mode ? jsPsych.data.displayData() : jsPsych.data.get().localSave('csv', 'exp1' + info["ID"] + '.csv');
    if (!test_model) document.exitFullscreen(); // 退出全屏
    let bodyNode = document.getElementsByTagName("body"); // 获取Body窗体
  }
});

var key = ['f', 'j']//按键
//正确率85%
const prac_acc_thres = 85;
let view_texts_images = [];

const stim_starts = [1000, 1150]// the previous is for target the last one is for test
const stim_ends = [1050, 1200]

const tb_repetitions = test_model ? 1 : 5;   // 此处填入试次的重复次数 5, 测试为 1
blockTotalNum1 = test_model ? 3 : 6;         // 此处填入总block数量 6, 测试为 3

/**--------------------------------------------
 *               定义刺激
 *---------------------------------------------**/

var texts = ["自我", "朋友", "他人"]//储存文字
let target_list = ["Image", "Word"]
const images = [
  '3_Stimuli/C_ambi40.png',
  '3_Stimuli/S_ambi40.png',
  '3_Stimuli/T_ambi40.png'
];
const preload = {
  type: jsPsychPreload,
  images: images,
};
timeline.push(preload);//preload图片

var Instructions1 = {
  type: jsPsychInstructions,
  pages: function () {
    let start = "<p class='header' style = 'font-size: 25px'>请您记住如下对应关系:</p>",
      middle = "<p class='footer'  style = 'font-size: 25px'>如果对本实验还有不清楚之处，请立即向实验员咨询。</p>",
      end = "<p style = 'font-size: 25px; line-height: 30px;'>如果您明白了规则：请点击 继续 进入练习</span></p><div>";
    let tmpI = "";
    view_texts_images.forEach(v => {
      tmpI += `<p class="content">${v}</p>`;
    });
    return ["<p class='header' style = 'font-size: 25px'>实验说明：</p><p style='color:white; font-size: 25px;line-height: 30px;'>您好，欢迎参加本实验。本次实验大约需要40分钟完成。</p><p style='color:white; font-size: 25px;'>在本实验中，您需要完成一个简单的知觉匹配任务。</p><p style='color:white; font-size: 25px;'>您将学习几种几何图形与不同标签的对应关系。</p>",
      start + `<div class="box">${tmpI}</div>` +
      `<p class='footer' style='font-size: 30px; line-height: 35px;'>您的任务是判断几何图形与图形名称或文字标签是否匹配，</p><p class='footer' style='color:white; font-size: 25px;'>如果二者匹配，请按<span style="color: lightgreen; font-size:25px">${key[0]}键</span></p><p class='footer' style='color:white; font-size: 25px;'>如果二者不匹配，请按<span style="color: lightgreen; font-size:25px"> ${key[1]}键</p></span><p class='footer' style='color:white; font-size: 20px;'>请在实验过程中将您的<span style="color: lightgreen;">食指</span>放在电脑键盘的相应键位上准备按键。</p></span>`,
      `<p style='color:white; font-size: 25px; line-height: 30px;'>您将首先完成一组由不同的刺激呈现顺序：<span style="color: yellow; ">先呈现图形后呈现文字或先呈现文字后呈现图形</span>组成的，一组24次按键的匹配任务练习。</p><p style='color:white; font-size: 25px; line-height: 30px;'>完成匹配任务的练习之后，您将完成每个条件下6组匹配任务，每组包括120次按键反应，每组完成后会有休息时间。</p><p style='color:white; font-size: 22px; line-height: 25px;'>完成一组任务大约需要7分钟，整个实验将持续大约50分钟。</p>`,//实验时间待修改
      middle + end];
  },
  show_clickable_nav: true,
  button_label_previous: " <span class='add_' style='color:black; font-size: 20px;'> 返回</span>",
  button_label_next: " <span class='add_' style='color:black; font-size: 20px;'> 继续</span>",
  on_load: () => {
    $("body").css("cursor", "default");
  },
  on_finish: function () {
    $("body").css("cursor", "none");
  } //鼠标消失术，放在要消失鼠标的前一个事件里
};

let tb = [];
(() => {
  target_list.forEach((tar) => {
    texts.forEach(((text, ind_t) => {
      images.forEach((image, ind_i) => {
        let Matchness = ind_t == ind_i
        let Valence = texts[ind_i]

        let stim_dict = {
          Image: image,
          word: text,
          identify: Matchness ? key[0] : key[1],
          target: tar,
          test: tar == "Image" ? "Word" : "Image",
          image_start: tar == "Image" ? stim_starts[0] : stim_starts[1],
          image_end: tar == "Image" ? stim_ends[0] : stim_ends[1],
          word_start: tar == "Word" ? stim_starts[0] : stim_starts[1],
          word_end: tar == "Word" ? stim_ends[0] : stim_ends[1],
          Valence: Valence,
          Matchness: Matchness ? "Match" : "Mismatch"
        }

        tb.push(stim_dict)
        if (Matchness) tb.push(stim_dict)
      })
    }))
  })
})();
// console.log('tb', tb)

/**--------------------------------------------
 *               定义练习阶段
 *---------------------------------------------**/

let prac_trials = {
  timeline: [
    {
      type: jsPsychPsychophysics,
      stimuli: [
        fixation(),
        {
          obj_type: "image",
          file: function () { return jsPsych.timelineVariable("Image") },
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
          content: function () {
            return jsPsych.timelineVariable('word');//记得后面要加括号
          },
          font: `${80}px 'Arial'`, //字体和颜色设置 文字视角：3.6° x 1.6°

          text_color: 'white',
          show_start_time: jsPsych.timelineVariable("word_start"), // ms after the start of the trial
          show_end_time: jsPsych.timelineVariable("word_end"),//直到反应才消失刺激
          origin_center: true//带确定
        }
      ],
      choices: ['f', 'j'],
      response_start_time: 1200, //TODO: 开始作答时间，第二个刺激结束开始计算
      trial_duration: 2700,      //结束时间，一共作答时间持续1500ms
      data: function () { return jsPsych.timelineVariable("identify") },
      on_finish: function (data) {
        data.correct_response = jsPsych.timelineVariable("identify");
        data.correct = data.correct_response == data.key_press;//0错1对
        data.Image = jsPsych.timelineVariable("Image");
        data.word = jsPsych.timelineVariable("word");
        data.target = jsPsych.timelineVariable("target");
        data.test = jsPsych.timelineVariable("test");
        data.image_start = jsPsych.timelineVariable("image_start");
        data.word_start = jsPsych.timelineVariable("word_start");
        data.Valence = jsPsych.timelineVariable("Valence");
        data.Matchness = jsPsych.timelineVariable("Matchness");
        data.exp_condition = "Practice"
      }
    },
    {
      data: {
        screen_id: "feedback"//这里为反馈
      },
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function () {
        let keypress = jsPsych.data.get().last(1).values()[0].key_press; // 被试按键
        //let trial_keypress = jsPsych.data.get().last(1).values()[0].correct; //该trial正确的按键
        let time = jsPsych.data.get().last(1).values()[0].rt;
        let trial_correct_response = jsPsych.data.get().last(1).values()[0].correct_response;//该trial正确的按键
        if (time > 1500 || time === null) { //大于1500或为null为过慢
          return "<span class='add_' style='color:yellow; font-size: 70px;'> 太慢! </span>"
        } else if (time < 200) { //小于两百为过快反应
          return "<span style='color:yellow; font-size: 70px;'>过快! </span>"
        } else {
          if (keypress == trial_correct_response) { //如果按键 == 正确按键
            return "<span style='color:GreenYellow; font-size: 70px;'>正确! </span>"
          }
          else {
            return "<span style='color:red; font-size: 70px;'>错误! </span>"
          }
        }
      },
      choices: "NO_KEYS",
      trial_duration: 300,//300ms反馈
    }
  ],
  timeline_variables: tb,
  randomize_order: true,
  repetitions: 1,
  on_finish: function () {
    // $("body").css("cursor", "default"); //鼠标出现
  }
};
var feedback_p = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    let trials = jsPsych.data.get().filter(
      [{ correct: true }, { correct: false }]
    ).last(24); // 运行逻辑：先挑出data里的所有的correct：true/false的数据行，成为新的数组，然后对倒数的某几组进行计算
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
  timeline: [prac_trials, if_node],
  loop_function: function () {
    var trials = jsPsych.data.get().filter(
      [{ correct: true }, { correct: false }]
    ).last(24);
    var correct_trials = trials.filter({
      correct: true
    });
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    if (accuracy >= prac_acc_thres) {
      return false;//end 进入正式实验前的反馈
    } else if (accuracy < acc) { // repeat
      return true;
    }
  }
};


/**--------------------------------------------
 *               定义正式实验
 *---------------------------------------------**/

let formal_trials = {
  timeline: [
    {
      type: jsPsychPsychophysics,
      stimuli: [
        fixation(),
        {
          obj_type: "image",
          file: function () { return jsPsych.timelineVariable("Image") },
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
          content: function () {
            return jsPsych.timelineVariable('word');//记得后面要加括号
          },
          font: `${80}px 'Arial'`, //字体和颜色设置 文字视角：3.6° x 1.6°
          text_color: 'white',
          show_start_time: jsPsych.timelineVariable("word_start"), // ms after the start of the trial
          show_end_time: jsPsych.timelineVariable("word_end"),//直到反应才消失刺激
          origin_center: true//带确定
        }
      ],
      choices: ['f', 'j'],
      response_start_time: 1200, //TODO: 开始作答时间，第二个刺激结束开始计算
      trial_duration: 2700,      //结束时间，一共作答时间持续1500ms
      data: function () { return jsPsych.timelineVariable("identify") },
      on_finish: function (data) {
        data.correct_response = jsPsych.timelineVariable("identify");
        data.correct = data.correct_response == data.key_press;//0错1对
        data.Image = jsPsych.timelineVariable("Image");
        data.word = jsPsych.timelineVariable("word");
        data.target = jsPsych.timelineVariable("target");
        data.test = jsPsych.timelineVariable("test");
        data.image_start = jsPsych.timelineVariable("image_start");
        data.word_start = jsPsych.timelineVariable("word_start");
        data.Valence = jsPsych.timelineVariable("Valence");
        data.Matchness = jsPsych.timelineVariable("Matchness");
        data.exp_condition = "Formal"
      }
    },
  ],
  timeline_variables: tb,
  randomize_order: true,
  repetitions: tb_repetitions,
  on_finish: function () {
    // $("body").css("cursor", "default"); //鼠标出现
  }
};
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

if (!test_model) {
  timeline.push(welcome);
  timeline.push(basic_information);
  timeline.push(information);
  timeline.push(chinrest);
  timeline.push(fullscreen_trial);
  timeline.push(Instructions1);
}
//timeline.push(prac_trials);
//timeline.push(feedback_p);
timeline.push(loop_node);
timeline.push(feedback_goformal);
timeline.push(repeatblock);

if (!test_model) timeline.push(finish);

jsPsych.run(timeline);