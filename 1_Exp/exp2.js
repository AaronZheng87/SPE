test_mode = false

const jsPsych = initJsPsych({
  /* auto_update_progress_bar: true,
   extensions: {
     type: naodao,
   }*/
  on_finish: function () {
    if (!test_mode) jsPsych.data.get().localSave('csv', 'exp2' + info["ID"] + '.csv');
    if (!test_mode) document.exitFullscreen(); // 退出全屏
    let bodyNode = document.getElementsByTagName("body"); // 获取Body窗体
  }
});




var key = ['f', 'j']//按键

//正确率85%
const acc = 85;

let view_texts_images = [];

const stim_start = 1000
const stim_duration = test_mode ? 500 : 50
const stim_duration_sim = test_mode ? 500 * 1 : 50 * 1 // TODO: 呈现 50 75 100？ 或者变化
const stim_SOA = 100
const stim_X_sim = [-175, 175]

const tb_repetitions = test_mode ? 1 : 5;   // 此处填入试次的重复次数 5, 测试为 1
blockTotalNum1 = test_mode ? 3 : 6;         // 此处填入总block数量 6, 测试为 3


var Instructions1 = {
  type: jsPsychInstructions,
  pages: function () {
    let start = "<p class='header' style = 'font-size: 25px'>请您记住如下对应关系:</p>",
      middle = "<p class='footer'  style = 'font-size: 25px'>如果对本实验还有不清楚之处，请立即向实验员咨询。</p>",
      end = "<p style = 'font-size: 25px; line-height: 30px;'>如果您明白了规则：请点击 继续 进入刺激呈现顺序为<span style='color: yellow;'>先图形后文字条件</span>的练习</span></p><div>";
    let tmpI = "";
    view_texts_images.forEach(v => {
      tmpI += `<p class="content">${v}</p>`;
    });
    return ["<p class='header' style = 'font-size: 25px'>实验说明：</p><p style='color:white; font-size: 25px;line-height: 30px;'>您好，欢迎参加本实验。本次实验大约需要50分钟完成。</p><p style='color:white; font-size: 25px;'>在本实验中，您需要完成一个简单的知觉匹配任务。</p><p style='color:white; font-size: 25px;'>您将学习几种几何图形与不同标签的对应关系。</p>",
      start + `<div class="box">${tmpI}</div>` +
      `<p class='footer' style='font-size: 30px; line-height: 35px;'>您的任务是在不同图形和文字呈现顺序的条件下判断几何图形与图形名称或文字标签是否匹配，</p><p class='footer' style='color:white; font-size: 25px;'>如果二者匹配，请按<span style="color: lightgreen; font-size:25px">${key[0]}键</span></p><p class='footer' style='color:white; font-size: 25px;'>如果二者不匹配，请按<span style="color: lightgreen; font-size:25px"> ${key[1]}键</p></span><p class='footer' style='color:white; font-size: 20px;'>请在实验过程中将您的<span style="color: lightgreen;">食指</span>放在电脑键盘的相应键位上准备按键。</p></span>`,
      `<p style='color:white; font-size: 25px; line-height: 30px;'>您将首先完成三组不同的刺激呈现顺序：<span style="color: yellow; ">先图形后文字、先文字后图形以及图形和文字同时呈现</span>条件下，每24次按键的匹配任务练习。</p><p style='color:white; font-size: 25px; line-height: 30px;'>完成匹配任务的练习之后，您将完成每个条件下4组匹配任务，每组包括60次按键反应，每组完成后会有休息时间。</p><p style='color:white; font-size: 22px; line-height: 25px;'>完成一组任务大约需要7分钟，整个实验将持续大约50分钟。</p>`,//实验时间待修改
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
}

/**--------------------------------------------
 *               定义刺激
 *---------------------------------------------**/

var texts = ["自我", "朋友", "他人"]//储存文字
const images = [
  '3_Stimuli/C_ambi40.png',
  '3_Stimuli/S_ambi40.png',
  '3_Stimuli/T_ambi40.png'
]
const preload = {
  type: jsPsychPreload,
  images: images,
}
timeline.push(preload);//preload图片

let tmp_stim = []
let block_type = ["image_first", "word_first", "simultaneous"]; // 0 image first; 1 word first; 2 simultaneously
// 生成 tb 刺激矩阵
(() => {
  texts.forEach(((text, ind_t) => {
    images.forEach((image, ind_i) => {
      let Matchness = ind_t == ind_i
      let Valence = texts[ind_i]

      let stim_dict = {
        image: image,
        word: text,
        identify: Matchness ? key[0] : key[1],
        valence: Valence,
        matchness: Matchness ? "Match" : "Mismatch"
      }

      tmp_stim.push(stim_dict)
      if (Matchness) tmp_stim.push(stim_dict)
    })
  }))
})();
let tb_img = tmp_stim.map(v => ({ ...v, target: "Image" }))
let tb_word = tmp_stim.map(v => ({ ...v, target: "Word" }))
let tb_sim = [tb_img, tb_word].flat()
// console.log('tb_word', tb_word)
// console.log('tb_word', tb_img)
console.log('tb_word', tb_sim)

/**--------------------------------------------
 *               定义练习
 *---------------------------------------------**/

let trials_generator = (tb, block_type = 0, repetitions = 1, exp_phase = "Practice") => {

  let startX1
  let startX2
  let show_start_time1
  let show_start_time2
  let show_end_time1
  let show_end_time2
  console.log('block_type', block_type)

  // 用于生成 show_start_time1 startX1等数据
  let generate_stim_condition = () => {
    let target = jsPsych.timelineVariable("target")
    if (block_type == 2) {
      show_start_time1 = show_start_time2 = stim_start
      show_end_time1 = show_end_time2 = show_start_time1 + stim_duration_sim

      if (target == "Image") {
        startX1 = stim_X_sim[0]
        startX2 = stim_X_sim[1]
      } else {
        startX1 = stim_X_sim[1]
        startX2 = stim_X_sim[0]
      }
    } else {
      startX1 = startX2 = 0
      if (target == "Image") {
        show_start_time1 = stim_start
        show_end_time1 = stim_start + stim_duration
        show_start_time2 = show_end_time1 + stim_SOA
        show_end_time2 = show_start_time2 + stim_duration
      }
      else {
        show_start_time2 = stim_start
        show_end_time2 = stim_start + stim_duration
        show_start_time1 = show_end_time2 + stim_SOA
        show_end_time1 = show_start_time1 + stim_duration
      }
    }
    console.log('target', target, "startX1", startX1, "show_start_time1", show_start_time1)
  };
  generate_stim_condition()
  let stim_presentation = {
    type: jsPsychPsychophysics,
    stimuli: [
      fixation(end = 1100),
      // 定义图片呈现 startX1 show_start_time1 等
      {
        obj_type: "image",
        file: () => jsPsych.timelineVariable("image"),
        startX: () => startX1, // location of the cross's center in the canvas
        startY: "center",
        width: 190,  // 调整图片大小 视角：3.8° x 3.8°
        heigth: 190, // 调整图片大小 视角：3.8° x 3.8°
        show_start_time: () => show_start_time1, // ms after the start of the trial
        show_end_time: () => show_end_time1,//出现50ms
        origin_center: true//待确定
      },
      // 定义词汇呈现 startX2 show_start_time2 等
      {
        obj_type: 'text',
        startX: () => startX2,
        startY: "center", //图形和文字距离 与加号等距
        content: () => jsPsych.timelineVariable('word'),
        font: `${80}px 'Arial'`, //字体和颜色设置 文字视角：3.6° x 1.6°
        text_color: 'white',
        show_start_time: () => show_start_time2, // ms after the start of the trial
        show_end_time: () => show_end_time2,//直到反应才消失刺激
        origin_center: true//带确定
      }
    ],
    choices: ['f', 'j'],
    response_start_time: Math.max(show_end_time1, show_end_time2), //TODO:  需要再次确认记录时间的位置，特别是对于同时呈现 
    trial_duration: 2500,//结束时间，一共作答时间持续1500ms
    on_start: generate_stim_condition,
    data: function () { return jsPsych.timelineVariable("identify") },
    on_finish: function (data) {
      data.correct_response = jsPsych.timelineVariable("identify");
      data.correct = data.correct_response == data.key_press;//0错1对
      data.Image = jsPsych.timelineVariable("image");
      data.word = jsPsych.timelineVariable("word");//加括号
      data.target = jsPsych.timelineVariable("target");
      data.Valence = jsPsych.timelineVariable("valence");
      data.Matchness = jsPsych.timelineVariable("matchness");
      data.exp_phase = exp_phase
      data.block_type = block_type
      console.log('finishi', data.target, data.Image, data.word, data.Valence, data.Matchness)
    }
  }

  let feedback_pac = {
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
  };
  let trial_procedure = [stim_presentation]
  if (exp_phase = "Practice") trial_procedure.push(feedback_pac)

  let timeline = {
    timeline: trial_procedure,
    timeline_variables: tb,
    randomize_order: true,
    repetitions: repetitions
  }

  return timeline
};

let prac_trials_sim = trials_generator(tb_sim, block_type = 2)
let prac_trials_word = trials_generator(tb_word, block_type = 1)
let prac_trials_img = trials_generator(tb_img, block_type = 0)


var feedback_p = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    let trials = jsPsych.data.get().filter(
      [{ correct: true }, { correct: false }]
    ).last(12); // 运行逻辑：先挑出data里的所有的correct：true/false的数据行，成为新的数组，然后对倒数的某几组进行计算
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
  }
}


if_node1 = { //if_node 用于判断是否呈现feedback，feedback_continue_practice
  timeline: [feedback_p, feedback_continue_practice],
  conditional_function: function (data) {
    var trials = jsPsych.data.get().filter(
      [{ correct: true }, { correct: false }]
    ).last(12);//这里注意：只需要上一组的练习数据，而不是所有的数据！！ 如何实现：.last() 取data最后的几组数据（上一组练习数据）
    var correct_trials = trials.filter({
      correct: true
    });
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    if (accuracy >= acc) {
      return false;//达标就skip掉feedback_continue_practice这一段
    } else if (accuracy < acc) { //没达标反馈feedback,feedback_continue_practice
      return true;
    }
  }
}

var loop_node1 = {
  timeline: [prac_trials_img, if_node1],
  loop_function: function () {
    var trials = jsPsych.data.get().filter(
      [{ correct: true }, { correct: false }]
    ).last(12);//记得改，取数据
    var correct_trials = trials.filter({
      correct: true
    });
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    if (accuracy >= acc) {
      return false;//end 进入正式实验前的反馈
    } else if (accuracy < acc) { // repeat
      return true;
    }
  }

}

var feedback_gow = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    let trials = jsPsych.data.get().filter(
      [{ correct: true }, { correct: false }]
    ).last(12);
    let correct_trials = trials.filter({
      correct: true
    });
    let accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    let rt = Math.round(correct_trials.select('rt').mean());
    return "<style>.context{color:white; font-size: 35px; line-height:40px}</style>\
                          <div><p class='context'>您正确回答了" + accuracy + "% 的试次。</p>" +
      "<p class='context'>您的平均反应时为" + rt + "毫秒。</p>" +
      "<p class='context'>恭喜您完成这一阶段的练习。按任意键进入<span style='color: yellow;'>先文字后图形条件</span>的练习。</p></div>";
  },
  on_finish: function () {
    $("body").css("cursor", "none");
  }
}

var feedback_continue_practice2 = { //在这里呈现文字recap，让被试再记一下
  type: jsPsychInstructions,
  pages: function () {
    let start = "<p class='header' style='font-size:25px; line-height:30px;'>请您努力记下如下匹配对应关系，再次进行练习。</p>",
      middle = "<p class='footer' style='font-size:25px; line-height:30px;'>如果对本实验还有不清楚之处，请立即向实验员咨询。</p>",
      end = "<p style='font-size:25px; line-height:30px;'>如果您明白了规则：</p><p style='font-size:22px; line-height:25px;'>请按 继续 进入练习</p><div>";
    let tmpI = "";
    view_texts_images.forEach(v => {
      tmpI += `<p class="content" style='font-size:25px'>${v}</p>`;
    });
    return ["<p class='header' style='font-size:25px; line-height:30px;'>您的正确率未达到进入下一阶段练习的要求。</p>",
      start + `<div class="box">${tmpI}</div>` +
      `<p class='footer' style='font-size:25px; line-height:30px;'>您的任务是判断几何图形与图形名称或文字标签是否匹配，</p><p class='footer' style='font-size:25px; line-height:30px;'>如果二者匹配，请按 <span style="color: lightgreen;">${key[0]} 键</span></p><p class='footer' style='font-size:25px'>如果二者不匹配，请按<span style="color: lightgreen;"> ${key[1]} 键</p></span><p class='footer' style='font-size:22px; line-height:25px;'>请在实验过程中将您的<span style="color: lightgreen;">食指</span>放在电脑键盘的相应键位上进行按键。</p></span>`,
      middle + end];
  },
  show_clickable_nav: true,
  button_label_previous: " <span class='add_' style='color:black; font-size: 20px;'> 返回</span>",
  button_label_next: " <span class='add_' style='color:black; font-size: 20px;'> 继续</span>",
  on_finish: function () {
    $("body").css("cursor", "none");
  },
  on_load: () => {
    $("body").css("cursor", "default");
  }
}

var if_node2 = { //if_node 用于判断是否呈现feedback，feedback_continue_practice
  timeline: [feedback_p, feedback_continue_practice2],
  conditional_function: function (data) {
    var trials = jsPsych.data.get().filter(
      [{ correct: true }, { correct: false }]
    ).last(12);//这里注意：只需要上一组的练习数据，而不是所有的数据！！ 如何实现：.last() 取data最后的几组数据（上一组练习数据）
    var correct_trials = trials.filter({
      correct: true
    });
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    if (accuracy >= acc) {
      return false;//达标就skip掉feedback_continue_practice这一段
    } else if (accuracy < acc) { //没达标反馈feedback,feedback_continue_practice
      return true;
    }
  }
}



var loop_node2 = {
  timeline: [prac_trials_word, if_node2],
  loop_function: function () {
    var trials = jsPsych.data.get().filter(
      [{ correct: true }, { correct: false }]
    ).last(12);//记得改，取数据
    var correct_trials = trials.filter({
      correct: true
    });
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    if (accuracy >= acc) {
      return false;//end 进入正式实验前的反馈
    } else if (accuracy < acc) { // repeat
      return true;
    }
  }
}


var feedback_gos = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    let trials = jsPsych.data.get().filter(
      [{ correct: true }, { correct: false }]
    ).last(12);
    let correct_trials = trials.filter({
      correct: true
    });
    let accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    let rt = Math.round(correct_trials.select('rt').mean());
    return "<style>.context{color:white; font-size: 35px; line-height:40px}</style>\
                          <div><p class='context'>您正确回答了" + accuracy + "% 的试次。</p>" +
      "<p class='context'>您的平均反应时为" + rt + "毫秒。</p>" +
      "<p class='context'>恭喜您完成练习。按任意键进入<span style='color: yellow;'>图形和文字同时呈现条件</span>的练习。</p></div>";
  },
  on_finish: function () {
    $("body").css("cursor", "none");
  }
}


var feedback_continue_practice3 = { //在这里呈现文字recap，让被试再记一下
  type: jsPsychInstructions,
  pages: function () {
    let start = "<p class='header' style='font-size:25px; line-height:30px;'>请您努力记下如下匹配对应关系，再次进行练习。</p>",
      middle = "<p class='footer' style='font-size:25px; line-height:30px;'>如果对本实验还有不清楚之处，请立即向实验员咨询。</p>",
      end = "<p style='font-size:25px; line-height:30px;'>如果您明白了规则：</p><p style='font-size:22px; line-height:25px;'>请按 继续 进入练习</p><div>";
    let tmpI = "";
    view_texts_images.forEach(v => {
      tmpI += `<p class="content" style='font-size:25px'>${v}</p>`;
    });
    return ["<p class='header' style='font-size:25px; line-height:30px;'>您的正确率未达到进入下一阶段练习的要求。</p>",
      start + `<div class="box">${tmpI}</div>` +
      `<p class='footer' style='font-size:25px; line-height:30px;'>您的任务是判断几何图形与图形名称或文字标签是否匹配，</p><p class='footer' style='font-size:25px; line-height:30px;'>如果二者匹配，请按 <span style="color: lightgreen;">${key[0]} 键</span></p><p class='footer' style='font-size:25px'>如果二者不匹配，请按<span style="color: lightgreen;"> ${key[1]} 键</p></span><p class='footer' style='font-size:22px; line-height:25px;'>请在实验过程中将您的<span style="color: lightgreen;">食指</span>放在电脑键盘的相应键位上进行按键。</p></span>`,
      middle + end];
  },
  show_clickable_nav: true,
  button_label_previous: " <span class='add_' style='color:black; font-size: 20px;'> 返回</span>",
  button_label_next: " <span class='add_' style='color:black; font-size: 20px;'> 继续</span>",
  on_finish: function () {
    $("body").css("cursor", "none");
  },
  on_load: () => {
    $("body").css("cursor", "default");
  }
}

var if_node3 = { //if_node 用于判断是否呈现feedback，feedback_continue_practice
  timeline: [feedback_p, feedback_continue_practice3],
  conditional_function: function (data) {
    var trials = jsPsych.data.get().filter(
      [{ correct: true }, { correct: false }]
    ).last(12);//这里注意：只需要上一组的练习数据，而不是所有的数据！！ 如何实现：.last() 取data最后的几组数据（上一组练习数据）
    var correct_trials = trials.filter({
      correct: true
    });
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    if (accuracy >= acc) {
      return false;//达标就skip掉feedback_continue_practice这一段
    } else if (accuracy < acc) { //没达标反馈feedback,feedback_continue_practice
      return true;
    }
  }
}

/**--------------------------------------------
 *               定义正式实验
 *---------------------------------------------**/


var loop_node3 = {
  timeline: [prac_trials_sim, if_node3],
  loop_function: function () {
    var trials = jsPsych.data.get().filter(
      [{ correct: true }, { correct: false }]
    ).last(12);//记得改，取数据
    var correct_trials = trials.filter({
      correct: true
    });
    var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    if (accuracy >= acc) {
      return false;//end 进入正式实验前的反馈
    } else if (accuracy < acc) { // repeat
      return true;
    }
  }
}


let image_first = {
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
          show_start_time: 1000, // ms after the start of the trial
          show_end_time: 1100,//出现50ms
          origin_center: true//待确定
        },//上一组end时间减去下一组show时间就是空屏的100ms
        {
          obj_type: 'text',
          startX: "center",
          startY: "center", //图形和文字距离 与加号等距
          content: function () {
            return jsPsych.timelineVariable('word');
          },
          font: `${80}px 'Arial'`, //字体和颜色设置 文字视角：3.6° x 1.6°

          text_color: 'white',
          show_start_time: 1000, // ms after the start of the trial
          show_end_time: 1100,//直到反应才消失刺激
          origin_center: true//带确定
        }
      ],

      choices: ['f', 'j'],
      response_start_time: 1150,//开始作答时间，第二个刺激开始计算
      trial_duration: 2650,//结束时间，一共作答时间持续1500ms
      data: function () { return jsPsych.timelineVariable("identify") },
      on_finish: function (data) {
        data.correct_response = jsPsych.timelineVariable("identify");
        data.correct = data.correct_response == data.key_press;//0错1对
        data.Image = jsPsych.timelineVariable("Image");
        data.word = jsPsych.timelineVariable("word");//加括号
        data.target = jsPsych.timelineVariable("target");
        data.test = jsPsych.timelineVariable("test");
        data.image_start = 1000;
        data.word_start = jsPsych.timelineVariable("word_start");
        data.Valence = jsPsych.timelineVariable("Valence");
        data.Matchness = jsPsych.timelineVariable("Matchness");
        data.exp_condition = "Formal"
      }
    }
  ],
  timeline_variables: tb_img,
  randomize_order: true,
  repetitions: 5,
  on_finish: function () {
    // $("body").css("cursor", "default"); //鼠标出现
  }
}


word_first = {
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
          show_start_time: 1000, // ms after the start of the trial
          show_end_time: 1100,//出现50ms
          origin_center: true//待确定
        },//上一组end时间减去下一组show时间就是空屏的100ms
        {
          obj_type: 'text',
          startX: "center",
          startY: "center", //图形和文字距离 与加号等距
          content: function () {
            return jsPsych.timelineVariable('word');
          },
          font: `${80}px 'Arial'`, //字体和颜色设置 文字视角：3.6° x 1.6°

          text_color: 'white',
          show_start_time: jsPsych.timelineVariable("word_start"), // ms after the start of the trial
          show_end_time: 1100,//直到反应才消失刺激
          origin_center: true//带确定
        }
      ],

      choices: ['f', 'j'],
      response_start_time: 1150,//开始作答时间，第二个刺激开始计算
      trial_duration: 2650,//结束时间，一共作答时间持续1500ms
      data: function () { return jsPsych.timelineVariable("identify") },
      on_finish: function (data) {
        data.correct_response = jsPsych.timelineVariable("identify");
        data.correct = data.correct_response == data.key_press;//0错1对
        data.Image = jsPsych.timelineVariable("Image");
        data.word = jsPsych.timelineVariable("word");//加括号
        data.target = jsPsych.timelineVariable("target");
        data.test = jsPsych.timelineVariable("test");
        data.image_start = 1000;
        data.word_start = jsPsych.timelineVariable("word_start");
        data.Valence = jsPsych.timelineVariable("Valence");
        data.Matchness = jsPsych.timelineVariable("Matchness");
        data.exp_condition = "Formal"
      }
    },
  ],
  timeline_variables: tb_word,
  randomize_order: true,
  repetitions: 5,
  on_finish: function () {
    // $("body").css("cursor", "default"); //鼠标出现
  }
}


let same = {
  timeline: [
    {
      type: jsPsychPsychophysics,
      stimuli: [
        fixation(end = 1100),
        {
          obj_type: "image",
          file: function () { return jsPsych.timelineVariable("Image") },
          startX: 175, // location of the cross's center in the canvas
          startY: "center",
          width: 190,  // 调整图片大小 视角：3.8° x 3.8°
          heigth: 190, // 调整图片大小 视角：3.8° x 3.8°
          show_start_time: 1000, // ms after the start of the trial
          show_end_time: 1100,//出现50ms
          origin_center: true//待确定
        },//上一组end时间减去下一组show时间就是空屏的100ms
        {
          obj_type: 'text',
          startX: -175,
          startY: "center", //图形和文字距离 与加号等距
          content: function () {
            return jsPsych.timelineVariable('word');
          },
          font: `${80}px 'Arial'`, //字体和颜色设置 文字视角：3.6° x 1.6°

          text_color: 'white',
          show_start_time: jsPsych.timelineVariable("word_start"), // ms after the start of the trial
          show_end_time: 1100,//直到反应才消失刺激
          origin_center: true//带确定
        }
      ],
      choices: ['f', 'j'],
      response_start_time: 1000,//开始作答时间，第二个刺激开始计算
      trial_duration: 2500,//结束时间，一共作答时间持续1500ms
      data: function () { return jsPsych.timelineVariable("identify") },
      on_finish: function (data) {
        data.correct_response = jsPsych.timelineVariable("identify");
        data.correct = data.correct_response == data.key_press;//0错1对
        data.Image = jsPsych.timelineVariable("Image");
        data.word = jsPsych.timelineVariable("word");//加括号
        data.target = jsPsych.timelineVariable("target");
        data.test = jsPsych.timelineVariable("test");
        data.image_start = 1000;
        data.word_start = jsPsych.timelineVariable("word_start");
        data.Valence = jsPsych.timelineVariable("Valence");
        data.Matchness = jsPsych.timelineVariable("Matchness");
        data.exp_condition = "Formal"
      }
    },
  ],
  timeline_variables: tb_sim,
  randomize_order: true,
  repetitions: 5,
  on_finish: function () {
    // $("body").css("cursor", "default"); //鼠标出现
  }
}

let feedback_block = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    // aaaaa = 1;  筛选，必须要！！！！！！！！！！！
    let trials = jsPsych.data.get().filter(
      [{ correct: true }, { correct: false }]
    ).last(60);// last()填入一个block里的trial总数
    let correct_trials = trials.filter({
      correct: true
    });
    let accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    let rt = Math.round(correct_trials.select('rt').mean());
    return "<style>.context{color:white; font-size: 35px; line-height:40px}</style>\
                          <div><p class='context'>您正确回答了" + accuracy + "% 的试次。</p>" +
      "<p class='context'>您的平均反应时为" + rt + "毫秒。</p>" +
      "<p class='context'>请按任意键进入休息</p></div>";
  },
  on_finish: function () {
    // $("body").css("cursor", "default"); //鼠标出现
  }
};


let blockTotalNum_image = 3;
let rest_image = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function () {
    let totaltrials = jsPsych.data.get().filter(
      [{ correct: true }, { correct: false }]
    );
    return `
                    <p>您当前还剩余${blockTotalNum_image}组实验</p>
                    <p>现在是休息时间，当您结束休息后，您可以点击 结束休息 按钮 继续</p>
                    <p>建议休息时间还剩余<span id="iii">60</span>秒</p>`
  },
  choices: ["结束休息"],
  on_load: function () {
    $("body").css("cursor", "default");
    let tmpTime = setInterval(function () {
      $("#iii").text(parseInt($("#iii").text()) - 1);
      if (parseInt($("#iii").text()) < 1) {
        $("#iii").parent().text("当前限定休息时间已到达，如果还未到达状态，请继续休息");
        clearInterval(parseInt(sessionStorage.getItem("tmpInter")));
      }
    }, 1000);
    sessionStorage.setItem("tmpInter", tmpTime);
  },
  on_finish: function () {
    $("body").css("cursor", "none"); //鼠标消失
    blockTotalNum_image -= 1;
    $(document.body).unbind();
    clearInterval(parseInt(sessionStorage.getItem("tmpInter")));
  }
}

let blockTotalNum_word = 3;// 此处填入总block数量-1，比如总数量是3，那么值就需要是2
let rest_word = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function () {
    let totaltrials = jsPsych.data.get().filter(
      [{ correct: true }, { correct: false }]
    );
    return `
                      <p>您当前还剩余${blockTotalNum_word}组实验</p>
                      <p>现在是休息时间，当您结束休息后，您可以点击 结束休息 按钮 继续</p>
                      <p>建议休息时间还剩余<span id="iii">60</span>秒</p>`
  },
  choices: ["结束休息"],
  on_load: function () {
    $("body").css("cursor", "default");
    let tmpTime = setInterval(function () {
      $("#iii").text(parseInt($("#iii").text()) - 1);
      if (parseInt($("#iii").text()) < 1) {
        $("#iii").parent().text("当前限定休息时间已到达，如果还未到达状态，请继续休息");
        clearInterval(parseInt(sessionStorage.getItem("tmpInter")));
      }
    }, 1000);
    sessionStorage.setItem("tmpInter", tmpTime);
  },
  on_finish: function () {
    $("body").css("cursor", "none"); //鼠标消失
    blockTotalNum_word -= 1;
    $(document.body).unbind();
    clearInterval(parseInt(sessionStorage.getItem("tmpInter")));
  }
}


let blockTotalNum_same = 3;
let rest_same = {
  type: jsPsychHtmlButtonResponse,
  stimulus: function () {
    let totaltrials = jsPsych.data.get().filter(
      [{ correct: true }, { correct: false }]
    );
    return `
                    <p>您当前还剩余${blockTotalNum_same}组实验</p>
                    <p>现在是休息时间，当您结束休息后，您可以点击 结束休息 按钮 继续</p>
                    <p>建议休息时间还剩余<span id="iii">60</span>秒</p>`
  },
  choices: ["结束休息"],
  on_load: function () {
    $("body").css("cursor", "default");
    let tmpTime = setInterval(function () {
      $("#iii").text(parseInt($("#iii").text()) - 1);
      if (parseInt($("#iii").text()) < 1) {
        $("#iii").parent().text("当前限定休息时间已到达，如果还未到达状态，请继续休息");
        clearInterval(parseInt(sessionStorage.getItem("tmpInter")));
      }
    }, 1000);
    sessionStorage.setItem("tmpInter", tmpTime);
  },
  on_finish: function () {
    $("body").css("cursor", "none"); //鼠标消失
    blockTotalNum_same -= 1;
    $(document.body).unbind();
    clearInterval(parseInt(sessionStorage.getItem("tmpInter")));
  }
}

let cong_image = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>恭喜您，正式实验中的呈现顺序为先图形后文字条件已经完成。</p>
    <p> <div style = "color: green"><按任意键继续></div></p>
    `,
  choices: "ALL_KEYS",
};

let cong_word = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>恭喜您，正式实验中的呈现顺序为先文字后图片条件已经完成。</p>
    <p> <div style = "color: green"><按任意键继续></div></p>
    `,
  choices: "ALL_KEYS",
};

let cong_same = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>恭喜您，正式实验中的呈现顺序为图形和文字同时呈现条件已经完成。</p>
    <p> <div style = "color: green"><按任意键继续></div></p>
    `,
  choices: "ALL_KEYS",
};

let p_gotoimage = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>请您将手指放在按键上，准备进入呈现顺序为<span style='color: yellow;'>先图形后文字条件</span>的正式匹配任务</p>
    <p> <div style = "color: green"><按任意键进入下一阶段的匹配任务></div></p>
    `,
  choices: "ALL_KEYS",
};

let p_gotoword = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>请您将手指放在按键上，准备进入呈现顺序为<span style='color: yellow;'>先文字后图形条件</span>的正式匹配任务</p>
    <p> <div style = "color: green"><按任意键进入下一阶段的匹配任务></div></p>
    `,
  choices: "ALL_KEYS",
};


let p_gotosame = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <p>请您将手指放在按键上，准备进入呈现顺序为<span style='color: yellow;'>图形和文字同时呈现条件</span>的正式匹配任务</p>
    <p> <div style = "color: green"><按任意键进入下一阶段的匹配任务></div></p>
    `,
  choices: "ALL_KEYS",
};

var repeatblock1 = [
  p_gotoimage,
  {
    timeline: [image_first, feedback_block, rest_image],
    repetitions: 4 //4个block
  },
  cong_image
];

var repeatblock2 = [
  p_gotoword,
  {
    timeline: [word_first, feedback_block, rest_word],
    repetitions: 4
  },
  cong_word
];

var repeatblock3 = [
  p_gotosame,
  {
    timeline: [same, feedback_block, rest_same],
    repetitions: 4
  },
  cong_same
];


// timeline.push(welcome);
// timeline.push(basic_information);
timeline.push(information);
//timeline.push(chinrest);
// timeline.push(fullscreen_trial);
// timeline.push(Instructions1);
//timeline.push(loop_node1)
//timeline.push(feedback_gow)
//timeline.push(loop_node2)
//timeline.push(feedback_gos)
timeline.push(loop_node3)
//timeline.push(feedback_goformal)

timeline.push({
  timeline: [{
    timeline: repeatblock1,
    conditional_function: () => {
      return jsPsych.timelineVariable("a", true) == 1
    }
  }, {
    timeline: repeatblock2,
    conditional_function: () => {
      return jsPsych.timelineVariable("a", true) == 2
    }
  }, {
    timeline: repeatblock3,
    conditional_function: () => {
      return jsPsych.timelineVariable("a", true) == 3
    }
  }],
  timeline_variables: jsPsych.randomization.factorial({
    a: jsPsych.randomization.shuffleNoRepeats(
      jsPsych.randomization.repeat([1, 2, 3], 1)
    )
  })
});

timeline.push(finish);
jsPsych.run(timeline);