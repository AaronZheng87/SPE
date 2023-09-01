const jsPsych = initJsPsych({
  /* auto_update_progress_bar: true,
   extensions: {
     type: naodao,
   }*/
  on_finish: function () {
    jsPsych.data.get().localSave('csv', 'exp1' + info["ID"] + '.csv');
    document.exitFullscreen(); // 退出全屏
    let bodyNode = document.getElementsByTagName("body"); // 获取Body窗体
  }
});


var texts = ["自我", "朋友", "他人"]//储存文字

var key = ['f', 'j']//按键
//正确率60%
let acc = 60;
let view_texts_images = [];


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
      `<p style='color:white; font-size: 25px; line-height: 30px;'>您将首先完成三组不同的刺激呈现顺序：<span style="color: yellow; ">先图形后文字、先文字后图形以及图形和文字同时呈现</span>条件下，每组24次按键的匹配任务练习。</p><p style='color:white; font-size: 25px; line-height: 30px;'>完成匹配任务的练习之后，您将完成每个条件下4组匹配任务，每组包括60次按键反应，每组完成后会有休息时间。</p><p style='color:white; font-size: 22px; line-height: 25px;'>完成一组任务大约需要7分钟，整个实验将持续大约50分钟。</p>`,//实验时间待修改
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


tb = [//restore the trials
  { Image: images[0], word: () => texts[0], identify: () => key[0] },
  { Image: images[1], word: () => texts[1], identify: () => key[0] },
  { Image: images[2], word: () => texts[2], identify: () => key[0] },

  { Image: images[0], word: () => texts[1], identify: () => key[1] },
  { Image: images[1], word: () => texts[2], identify: () => key[1] },
  { Image: images[2], word: () => texts[0], identify: () => key[1] },

  { Image: images[0], word: () => texts[2], identify: () => key[1] },
  { Image: images[1], word: () => texts[0], identify: () => key[1] },
  { Image: images[2], word: () => texts[1], identify: () => key[1] },

  { Image: images[0], word: () => texts[0], identify: () => key[0] },
  { Image: images[1], word: () => texts[1], identify: () => key[0] },
  { Image: images[2], word: () => texts[2], identify: () => key[0] },
];

let prac_i = {
  timeline: [
    {
      type: jsPsychPsychophysics,
      stimuli: [
        {
          obj_type: 'cross',
          startX: "center", // location of the cross's center in the canvas
          startY: "center",
          line_length: 40,
          line_width: 5,
          line_color: 'white', // You can use the HTML color name instead of the HEX color.
          show_start_time: 500,
          show_end_time: 1000// ms after the start of the trial
        },
        {
          obj_type: "image",
          file: function () { return jsPsych.timelineVariable("Image") },
          startX: "center", // location of the cross's center in the canvas
          startY: "center",
          width: 190,  // 调整图片大小 视角：3.8° x 3.8°
          heigth: 190, // 调整图片大小 视角：3.8° x 3.8°
          show_start_time: 1000, // ms after the start of the trial
          show_end_time: 1050,//出现50ms
          origin_center: true//待确定
        },//上一组end时间减去下一组show时间就是空屏的100ms
        {
          obj_type: 'text',
          startX: "center",
          startY: "center", //图形和文字距离 与加号等距
          content: function () {
            return jsPsych.timelineVariable('word', true)();//记得后面要加括号
          },
          font: `${80}px 'Arial'`, //字体和颜色设置 文字视角：3.6° x 1.6°

          text_color: 'white',
          show_start_time: 1150, // ms after the start of the trial
          //show_end_time: 1200,直到反应才消失刺激
          origin_center: true//带确定
        }
      ],

      choices: ['f', 'j'],
      response_start_time: 1150,//开始作答时间，第二个刺激开始计算
      trial_duration: 2650,//结束时间，一共作答时间持续1500ms
      data: function () { return jsPsych.timelineVariable("identify") },
      on_finish: function (data) {
        data.correct_response = jsPsych.timelineVariable("identify", true)();
        data.correct = data.correct_response == data.key_press;//0错1对
        data.Image = jsPsych.timelineVariable("Image");
        data.word = jsPsych.timelineVariable("word", true)();//加括号
        data.target = "image";
        data.test = "word";
        data.condition = "prac_image_first"
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
  repetitions: 2,
  on_finish: function () {
    // $("body").css("cursor", "default"); //鼠标出现
  }
}



let formal_i = {
  timeline: [
    {
      type: jsPsychPsychophysics,
      stimuli: [
        {
          obj_type: 'cross',
          startX: "center", // location of the cross's center in the canvas
          startY: "center",
          line_length: 40,
          line_width: 5,
          line_color: 'white', // You can use the HTML color name instead of the HEX color.
          show_start_time: 500,
          show_end_time: 1000// ms after the start of the trial
        },
        {
          obj_type: "image",
          file: function () { return jsPsych.timelineVariable("Image") },
          startX: "center", // location of the cross's center in the canvas
          startY: "center",
          width: 190,  // 调整图片大小 视角：3.8° x 3.8°
          heigth: 190, // 调整图片大小 视角：3.8° x 3.8°
          show_start_time: 1000, // ms after the start of the trial
          show_end_time: 1050,//出现50ms
          origin_center: true//待确定
        },//上一组end时间减去下一组show时间就是空屏的100ms
        {
          obj_type: 'text',
          startX: "center",
          startY: "center", //图形和文字距离 与加号等距
          content: function () {
            return jsPsych.timelineVariable('word', true)();//记得后面要加括号
          },
          font: `${80}px 'Arial'`, //字体和颜色设置 文字视角：3.6° x 1.6°

          text_color: 'white',
          show_start_time: 1150, // ms after the start of the trial
          //show_end_time: 1200,直到反应才消失刺激
          origin_center: true//带确定
        }
      ],

      choices: ['f', 'j'],
      response_start_time: 1150,//开始作答时间，第二个刺激开始计算
      trial_duration: 2650,//结束时间，一共作答时间持续1500ms
      data: function () { return jsPsych.timelineVariable("identify") },
      on_finish: function (data) {
        data.correct_response = jsPsych.timelineVariable("identify", true)();
        data.correct = data.correct_response == data.key_press;//0错1对
        data.Image = jsPsych.timelineVariable("Image");
        data.word = jsPsych.timelineVariable("word", true)();//加括号
        data.target = "image";
        data.test = "word";
        data.condition = "prac_image_first"
      }
    },
  ],
  timeline_variables: tb,
  randomize_order: true,
  repetitions: 2,
  on_finish: function () {
    // $("body").css("cursor", "default"); //鼠标出现
  }
}


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
      "<p class='context'>您的平均反应时为" + rt + "毫秒。</p>";
  }
}

timeline.push(basic_information);
timeline.push(information);
timeline.push(Instructions1);
timeline.push(formal_i);
timeline.push(feedback_p);
jsPsych.run(timeline);