test_model = false

const jsPsych = initJsPsych({
  /* auto_update_progress_bar: true,
   extensions: {
     type: naodao,
   }*/
  on_finish: function () {
    if (!test_model) jsPsych.data.get().localSave('csv', 'exp2' + info["ID"] + '.csv');
    if (!test_model) document.exitFullscreen(); // 退出全屏
    let bodyNode = document.getElementsByTagName("body"); // 获取Body窗体
  }
});


var texts = ["自我", "朋友", "他人"]//储存文字

var key = ['f', 'j']//按键

//正确率85%
const acc = 85;

let view_texts_images = [];

stim_x = [1000, 1150]// the previous is for target the last one is for test
stim_y = [1050, 1200]


stim_starts = [1000, 1150, 1000]// the previous is for target the last one is for test, the last one is for simultaneous condition
stim_ends = [1050, 1200, 1100]

const tb_repetitions = test_model ? 1 : 5;   // 此处填入试次的重复次数 5, 测试为 1
blockTotalNum1 = test_model ? 3 : 6;         // 此处填入总block数量 6, 测试为 3


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


tb_sim = [//restore the trials
  // image first
  { Image: images[0], word: () => texts[0], identify: () => key[0], target: 'None', test: "None", image_start: stim_starts[2], image_end: stim_ends[2], word_start: stim_starts[2], word_end: stim_ends[2], Valence: () => texts[0], Matchness: "Match" },
  { Image: images[1], word: () => texts[1], identify: () => key[0], target: 'None', test: "None", image_start: stim_starts[2], image_end: stim_ends[2], word_start: stim_starts[2], word_end: stim_ends[2], Valence: () => texts[1], Matchness: "Match" },
  { Image: images[2], word: () => texts[2], identify: () => key[0], target: 'None', test: "None", image_start: stim_starts[2], image_end: stim_ends[2], word_start: stim_starts[2], word_end: stim_ends[2], Valence: () => texts[2], Matchness: "Match" },

  { Image: images[0], word: () => texts[1], identify: () => key[1], target: 'None', test: "None", image_start: stim_starts[2], image_end: stim_ends[2], word_start: stim_starts[2], word_end: stim_ends[2], Valence: () => texts[0], Matchness: "Match" },
  { Image: images[1], word: () => texts[2], identify: () => key[1], target: 'None', test: "None", image_start: stim_starts[2], image_end: stim_ends[2], word_start: stim_starts[2], word_end: stim_ends[2], Valence: () => texts[1], Matchness: "Match" },
  { Image: images[2], word: () => texts[0], identify: () => key[1], target: 'None', test: "None", image_start: stim_starts[2], image_end: stim_ends[2], word_start: stim_starts[2], word_end: stim_ends[2], Valence: () => texts[2], Matchness: "Match" },

  { Image: images[0], word: () => texts[2], identify: () => key[1], target: 'None', test: "None", image_start: stim_starts[2], image_end: stim_ends[2], word_start: stim_starts[2], word_end: stim_ends[2], Valence: () => texts[0], Matchness: "Match" },
  { Image: images[1], word: () => texts[0], identify: () => key[1], target: 'None', test: "None", image_start: stim_starts[2], image_end: stim_ends[2], word_start: stim_starts[2], word_end: stim_ends[2], Valence: () => texts[1], Matchness: "Match" },
  { Image: images[2], word: () => texts[1], identify: () => key[1], target: 'None', test: "None", image_start: stim_starts[2], image_end: stim_ends[2], word_start: stim_starts[2], word_end: stim_ends[2], Valence: () => texts[2], Matchness: "Match" },

  { Image: images[0], word: () => texts[0], identify: () => key[0], target: 'None', test: "None", image_start: stim_starts[2], image_end: stim_ends[2], word_start: stim_starts[2], word_end: stim_ends[2], Valence: () => texts[0], Matchness: "Match" },
  { Image: images[1], word: () => texts[1], identify: () => key[0], target: 'None', test: "None", image_start: stim_starts[2], image_end: stim_ends[2], word_start: stim_starts[2], word_end: stim_ends[2], Valence: () => texts[1], Matchness: "Match" },
  { Image: images[2], word: () => texts[2], identify: () => key[0], target: 'None', test: "None", image_start: stim_starts[2], image_end: stim_ends[2], word_start: stim_starts[2], word_end: stim_ends[2], Valence: () => texts[2], Matchness: "Match" },
];



tb_word = [
  { Image: images[0], word: () => texts[0], identify: () => key[0], target: 'Word', test: "Image", image_start: stim_starts[1], image_end: stim_ends[1], word_start: stim_starts[0], word_end: stim_ends[0], Valence: () => texts[0], Matchness: "Match" },
  { Image: images[1], word: () => texts[1], identify: () => key[0], target: 'Word', test: "Image", image_start: stim_starts[1], image_end: stim_ends[1], word_start: stim_starts[0], word_end: stim_ends[0], Valence: () => texts[1], Matchness: "Match" },
  { Image: images[2], word: () => texts[2], identify: () => key[0], target: 'Word', test: "Image", image_start: stim_starts[1], image_end: stim_ends[1], word_start: stim_starts[0], word_end: stim_ends[0], Valence: () => texts[2], Matchness: "Match" },

  { Image: images[0], word: () => texts[1], identify: () => key[1], target: 'Word', test: "Image", image_start: stim_starts[1], image_end: stim_ends[1], word_start: stim_starts[0], word_end: stim_ends[0], Valence: () => texts[0], Matchness: "Mismatch" },
  { Image: images[1], word: () => texts[2], identify: () => key[1], target: 'Word', test: "Image", image_start: stim_starts[1], image_end: stim_ends[1], word_start: stim_starts[0], word_end: stim_ends[0], Valence: () => texts[1], Matchness: "Mismatch" },
  { Image: images[2], word: () => texts[0], identify: () => key[1], target: 'Word', test: "Image", image_start: stim_starts[1], image_end: stim_ends[1], word_start: stim_starts[0], word_end: stim_ends[0], Valence: () => texts[2], Matchness: "Mismatch" },

  { Image: images[0], word: () => texts[2], identify: () => key[1], target: 'Word', test: "Image", image_start: stim_starts[1], image_end: stim_ends[1], word_start: stim_starts[0], word_end: stim_ends[0], Valence: () => texts[0], Matchness: "Mismatch" },
  { Image: images[1], word: () => texts[0], identify: () => key[1], target: 'Word', test: "Image", image_start: stim_starts[1], image_end: stim_ends[1], word_start: stim_starts[0], word_end: stim_ends[0], Valence: () => texts[1], Matchness: "Mismatch" },
  { Image: images[2], word: () => texts[1], identify: () => key[1], target: 'Word', test: "Image", image_start: stim_starts[1], image_end: stim_ends[1], word_start: stim_starts[0], word_end: stim_ends[0], Valence: () => texts[2], Matchness: "Mismatch" },

  { Image: images[0], word: () => texts[0], identify: () => key[0], target: 'Word', test: "Image", image_start: stim_starts[1], image_end: stim_ends[1], word_start: stim_starts[0], word_end: stim_ends[0], Valence: () => texts[0], Matchness: "Match" },
  { Image: images[1], word: () => texts[1], identify: () => key[0], target: 'Word', test: "Image", image_start: stim_starts[1], image_end: stim_ends[1], word_start: stim_starts[0], word_end: stim_ends[0], Valence: () => texts[1], Matchness: "Match" },
  { Image: images[2], word: () => texts[2], identify: () => key[0], target: 'Word', test: "Image", image_start: stim_starts[1], image_end: stim_ends[1], word_start: stim_starts[0], word_end: stim_ends[0], Valence: () => texts[2], Matchness: "Match" }
];

tb_img = [
  { Image: images[0], word: () => texts[0], identify: () => key[0], target: 'Image', test: "Word", image_start: stim_starts[0], image_end: stim_ends[0], word_start: stim_starts[1], word_end: stim_ends[1], Valence: () => texts[0], Matchness: "Match" },
  { Image: images[1], word: () => texts[1], identify: () => key[0], target: 'Image', test: "Word", image_start: stim_starts[0], image_end: stim_ends[0], word_start: stim_starts[1], word_end: stim_ends[1], Valence: () => texts[1], Matchness: "Match" },
  { Image: images[2], word: () => texts[2], identify: () => key[0], target: 'Image', test: "Word", image_start: stim_starts[0], image_end: stim_ends[0], word_start: stim_starts[1], word_end: stim_ends[1], Valence: () => texts[2], Matchness: "Match" },
  { Image: images[0], word: () => texts[1], identify: () => key[1], target: 'Image', test: "Word", image_start: stim_starts[0], image_end: stim_ends[0], word_start: stim_starts[1], word_end: stim_ends[1], Valence: () => texts[0], Matchness: "Mismatch" },
  { Image: images[1], word: () => texts[2], identify: () => key[1], target: 'Image', test: "Word", image_start: stim_starts[0], image_end: stim_ends[0], word_start: stim_starts[1], word_end: stim_ends[1], Valence: () => texts[1], Matchness: "Mismatch" },
  { Image: images[2], word: () => texts[0], identify: () => key[1], target: 'Image', test: "Word", image_start: stim_starts[0], image_end: stim_ends[0], word_start: stim_starts[1], word_end: stim_ends[1], Valence: () => texts[2], Matchness: "Mismatch" },

  { Image: images[0], word: () => texts[2], identify: () => key[1], target: 'Image', test: "Word", image_start: stim_starts[0], image_end: stim_ends[0], word_start: stim_starts[1], word_end: stim_ends[1], Valence: () => texts[0], Matchness: "Mismatch" },
  { Image: images[1], word: () => texts[0], identify: () => key[1], target: 'Image', test: "Word", image_start: stim_starts[0], image_end: stim_ends[0], word_start: stim_starts[1], word_end: stim_ends[1], Valence: () => texts[1], Matchness: "Mismatch" },
  { Image: images[2], word: () => texts[1], identify: () => key[1], target: 'Image', test: "Word", image_start: stim_starts[0], image_end: stim_ends[0], word_start: stim_starts[1], word_end: stim_ends[1], Valence: () => texts[2], Matchness: "Mismatch" },

  { Image: images[0], word: () => texts[0], identify: () => key[0], target: 'Image', test: "Word", image_start: stim_starts[0], image_end: stim_ends[0], word_start: stim_starts[1], word_end: stim_ends[1], Valence: () => texts[0], Matchness: "Match" },
  { Image: images[1], word: () => texts[1], identify: () => key[0], target: 'Image', test: "Word", image_start: stim_starts[0], image_end: stim_ends[0], word_start: stim_starts[1], word_end: stim_ends[1], Valence: () => texts[1], Matchness: "Match" },
  { Image: images[2], word: () => texts[2], identify: () => key[0], target: 'Image', test: "Word", image_start: stim_starts[0], image_end: stim_ends[0], word_start: stim_starts[1], word_end: stim_ends[1], Valence: () => texts[2], Matchness: "Match" },
];



let prac_trials_sim = {
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
          show_end_time: 1100// ms after the start of the trial
        },
        {
          obj_type: "image",
          file: function () { return jsPsych.timelineVariable("Image") },
          startX: "center", // location of the cross's center in the canvas
          startY: -175,
          width: 190,  // 调整图片大小 视角：3.8° x 3.8°
          heigth: 190, // 调整图片大小 视角：3.8° x 3.8°
          show_start_time: jsPsych.timelineVariable("image_start"), // ms after the start of the trial
          show_end_time: jsPsych.timelineVariable("image_end"),//出现50ms
          origin_center: true//待确定
        },//上一组end时间减去下一组show时间就是空屏的100ms
        {
          obj_type: 'text',
          startX: "center",
          startY: 175, //图形和文字距离 与加号等距
          content: function () {
            return jsPsych.timelineVariable('word', true)();//记得后面要加括号
          },
          font: `${80}px 'Arial'`, //字体和颜色设置 文字视角：3.6° x 1.6°

          text_color: 'white',
          show_start_time: jsPsych.timelineVariable("word_start"), // ms after the start of the trial
          show_end_time: jsPsych.timelineVariable("word_end"),//直到反应才消失刺激
          origin_center: true//带确定
        }
      ],

      choices: ['f', 'j'],
      response_start_time: 1000,//开始作答时间，第二个刺激开始计算
      trial_duration: 2500,//结束时间，一共作答时间持续1500ms
      data: function () { return jsPsych.timelineVariable("identify") },
      on_finish: function (data) {
        data.correct_response = jsPsych.timelineVariable("identify", true)();
        data.correct = data.correct_response == data.key_press;//0错1对
        data.Image = jsPsych.timelineVariable("Image");
        data.word = jsPsych.timelineVariable("word", true)();//加括号
        data.target = jsPsych.timelineVariable("target");
        data.test = jsPsych.timelineVariable("test");
        data.image_start = jsPsych.timelineVariable("image_start");
        data.word_start = jsPsych.timelineVariable("word_start");
        data.Valence = jsPsych.timelineVariable("Valence", true)();
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
  timeline_variables: tb_sim,
  randomize_order: true,
  repetitions: 1,
  on_finish: function () {
    // $("body").css("cursor", "default"); //鼠标出现
  }
}




let prac_trials_word = {
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
          show_start_time: jsPsych.timelineVariable("image_start"), // ms after the start of the trial
          show_end_time: jsPsych.timelineVariable("image_end"),//出现50ms
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
          show_start_time: jsPsych.timelineVariable("word_start"), // ms after the start of the trial
          show_end_time: jsPsych.timelineVariable("word_end"),//直到反应才消失刺激
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
        data.target = jsPsych.timelineVariable("target");
        data.test = jsPsych.timelineVariable("test");
        data.image_start = jsPsych.timelineVariable("image_start");
        data.word_start = jsPsych.timelineVariable("word_start");
        data.Valence = jsPsych.timelineVariable("Valence", true)();
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
  timeline_variables: tb_word,
  randomize_order: true,
  repetitions: 1,
  on_finish: function () {
    // $("body").css("cursor", "default"); //鼠标出现
  }
}

let prac_trials_img = {
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
          show_start_time: jsPsych.timelineVariable("image_start"), // ms after the start of the trial
          show_end_time: jsPsych.timelineVariable("image_end"),//出现50ms
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
          show_start_time: jsPsych.timelineVariable("word_start"), // ms after the start of the trial
          show_end_time: jsPsych.timelineVariable("word_end"),//直到反应才消失刺激
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
        data.target = jsPsych.timelineVariable("target");
        data.test = jsPsych.timelineVariable("test");
        data.image_start = jsPsych.timelineVariable("image_start");
        data.word_start = jsPsych.timelineVariable("word_start");
        data.Valence = jsPsych.timelineVariable("Valence", true)();
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
  timeline_variables: tb_img,
  randomize_order: true,
  repetitions: 1,
  on_finish: function () {
    // $("body").css("cursor", "default"); //鼠标出现
  }
}



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
          show_start_time: jsPsych.timelineVariable("image_start"), // ms after the start of the trial
          show_end_time: jsPsych.timelineVariable("image_end"),//出现50ms
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
          show_start_time: jsPsych.timelineVariable("word_start"), // ms after the start of the trial
          show_end_time: jsPsych.timelineVariable("word_end"),//直到反应才消失刺激
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
        data.target = jsPsych.timelineVariable("target");
        data.test = jsPsych.timelineVariable("test");
        data.image_start = jsPsych.timelineVariable("image_start");
        data.word_start = jsPsych.timelineVariable("word_start");
        data.Valence = jsPsych.timelineVariable("Valence", true)();
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
          show_start_time: jsPsych.timelineVariable("image_start"), // ms after the start of the trial
          show_end_time: jsPsych.timelineVariable("image_end"),//出现50ms
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
          show_start_time: jsPsych.timelineVariable("word_start"), // ms after the start of the trial
          show_end_time: jsPsych.timelineVariable("word_end"),//直到反应才消失刺激
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
        data.target = jsPsych.timelineVariable("target");
        data.test = jsPsych.timelineVariable("test");
        data.image_start = jsPsych.timelineVariable("image_start");
        data.word_start = jsPsych.timelineVariable("word_start");
        data.Valence = jsPsych.timelineVariable("Valence", true)();
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
        {
          obj_type: 'cross',
          startX: "center", // location of the cross's center in the canvas
          startY: "center",
          line_length: 40,
          line_width: 5,
          line_color: 'white', // You can use the HTML color name instead of the HEX color.
          show_start_time: 500,
          show_end_time: 1100// ms after the start of the trial
        },
        {
          obj_type: "image",
          file: function () { return jsPsych.timelineVariable("Image") },
          startX: "center", // location of the cross's center in the canvas
          startY: -175,
          width: 190,  // 调整图片大小 视角：3.8° x 3.8°
          heigth: 190, // 调整图片大小 视角：3.8° x 3.8°
          show_start_time: jsPsych.timelineVariable("image_start"), // ms after the start of the trial
          show_end_time: jsPsych.timelineVariable("image_end"),//出现50ms
          origin_center: true//待确定
        },//上一组end时间减去下一组show时间就是空屏的100ms
        {
          obj_type: 'text',
          startX: "center",
          startY: 175, //图形和文字距离 与加号等距
          content: function () {
            return jsPsych.timelineVariable('word', true)();//记得后面要加括号
          },
          font: `${80}px 'Arial'`, //字体和颜色设置 文字视角：3.6° x 1.6°

          text_color: 'white',
          show_start_time: jsPsych.timelineVariable("word_start"), // ms after the start of the trial
          show_end_time: jsPsych.timelineVariable("word_end"),//直到反应才消失刺激
          origin_center: true//带确定
        }
      ],

      choices: ['f', 'j'],
      response_start_time: 1000,//开始作答时间，第二个刺激开始计算
      trial_duration: 2500,//结束时间，一共作答时间持续1500ms
      data: function () { return jsPsych.timelineVariable("identify") },
      on_finish: function (data) {
        data.correct_response = jsPsych.timelineVariable("identify", true)();
        data.correct = data.correct_response == data.key_press;//0错1对
        data.Image = jsPsych.timelineVariable("Image");
        data.word = jsPsych.timelineVariable("word", true)();//加括号
        data.target = jsPsych.timelineVariable("target");
        data.test = jsPsych.timelineVariable("test");
        data.image_start = jsPsych.timelineVariable("image_start");
        data.word_start = jsPsych.timelineVariable("word_start");
        data.Valence = jsPsych.timelineVariable("Valence", true)();
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


timeline.push(welcome);
timeline.push(basic_information);
timeline.push(information);
//timeline.push(chinrest);
timeline.push(fullscreen_trial);
timeline.push(Instructions1);
//timeline.push(loop_node1)
//timeline.push(feedback_gow)
//timeline.push(loop_node2)
//timeline.push(feedback_gos)
//timeline.push(loop_node3)
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