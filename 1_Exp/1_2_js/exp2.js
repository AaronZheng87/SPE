test_mode = false

const jsPsych = initJsPsych({
  /* auto_update_progress_bar: true,
   extensions: {
     type: naodao,
   }*/
  on_finish: function () {
    test_mode ? jsPsych.data.displayData() : jsPsych.data.get().localSave('csv', 'exp2' + SUBJ_INFO["ID"] + '.csv');
    if (!test_mode) document.exitFullscreen(); // 退出全屏
    let bodyNode = document.getElementsByTagName("body"); // 获取Body窗体
  }
});

var key = ['f', 'j']//按键

//练习阶段需要达到的正确率 85%
const prac_acc_thres = test_mode ? 0 : 85;

const stim_start = 1000
const stim_duration = 50
const stim_duration_sim = 50 * 1 // TODO: 呈现 50 75 100？ 或者变化
const stim_SOA = 100
const stim_X_sim = [-175, 175]

const repetition_stim = test_mode ? 1 : 3;   // 此处填入试次的重复次数 5, 测试为 1
const repetition_block = test_mode ? 2 : 4;  // 此处填入总block数量 6, 测试为 3

/**--------------------------------------------
 *               定义刺激
 *---------------------------------------------**/

var texts = ["自我", "朋友", "他人"]//储存文字
const preload = {
  type: jsPsychPreload,
  images: images,
}
timeline.push(preload);//preload图片

let tmp_stim = []
let block_type = ["先图形后文字", "先文字后图形", "图形和文字同时呈现"]; // 0 image first; 1 word first; 2 simultaneously
// 生成 tb 刺激矩阵， 12个刺激为一组
let stim_matrix_generator = () => {
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
};
// 对刺激顺序进行随机
shuffle_stim()
// 生成不同 block 的刺激矩阵，24个为一组。 原因在于平衡同时呈现时的 target的左右问题。
stim_matrix_generator()
let tb_img = tmp_stim.map(v => ({ ...v, target: "Image" }))
let tb_word = tmp_stim.map(v => ({ ...v, target: "Word" }))
let tb_sim = [tb_img, tb_word].flat()
tb_img = [...tb_img, ...tb_img]
tb_word = [...tb_word, ...tb_word]
// console.log('tb_sim', tb_sim)
// console.log('tb_word', tb_word)
let tb = [tb_img, tb_word, tb_sim]

/**----------------------
 *!    指导需要平衡按键。因此根据 info["iD"] 修改全局变量，key，images，texts。 并生成刺激矩阵 tb
 *------------------------**/

/**--------------------------------------------
 *               定义练习
 *---------------------------------------------**/

let block_generator = (block_id = 0, repetitions = 1, exp_phase = "Practice") => {

  let show_start_time1
  let show_start_time2
  let show_end_time1
  let show_end_time2
  // console.log('block_id', block_id)

  if (block_id == 2) {
    show_start_time1 = show_start_time2 = stim_start
    show_end_time1 = show_end_time2 = show_start_time1 + stim_duration_sim
  }
  else if (block_id == 0) {
    show_start_time1 = stim_start
    show_end_time1 = stim_start + stim_duration
    show_start_time2 = show_end_time1 + stim_SOA
    show_end_time2 = show_start_time2 + stim_duration
  }
  else if (block_id == 1) {
    show_start_time2 = stim_start
    show_end_time2 = stim_start + stim_duration
    show_start_time1 = show_end_time2 + stim_SOA
    show_end_time1 = show_start_time1 + stim_duration
  }
  let tb_tmp2 = tb[block_id]
  // console.log(block_id, "tb_tmp2 -----", tb_tmp2)
  let tb_tmp = tb_tmp2.map((tb_i) => {
    let target = tb_i.target
    let startX1
    let startX2
    if (block_id == 2) {
      // console.log('target', target == "Image" ? stim_X_sim[1] : stim_X_sim[0])
      startX1 = target == "Image" ? stim_X_sim[1] : stim_X_sim[0]
      startX2 = -startX1
    }
    else {
      startX1 = 0
      startX2 = 0
    }
    console.log(block_id, target, startX1)
    return { ...tb_i, startX1: startX1, startX2, startX2 };
  })
  // console.log(block_id, "tb_tmp-----", tb_tmp)

  /**----------------------
   *    单个trial的呈现定义
   *------------------------**/
  let stim_presentation = {
    type: jsPsychPsychophysics,
    stimuli: [
      fixation(end = 1100),                      //TODO:  这里为什么是 1100？ 
      // 定义图片呈现 startX1 show_start_time1 等
      {
        obj_type: "image",
        file: () => jsPsych.timelineVariable("image"),
        startX: () => jsPsych.timelineVariable("startX1"), // location of the cross's center in the canvas
        startY: "center",
        width: 190,  // 调整图片大小 视角：3.8° x 3.8°
        heigth: 190, // 调整图片大小 视角：3.8° x 3.8°
        show_start_time: () => show_start_time1, // ms after the start of the trial
        show_end_time: () => show_end_time1, //出现50ms
        origin_center: true//待确定
      },
      // 定义词汇呈现 startX2 show_start_time2 等
      {
        obj_type: 'text',
        startX: jsPsych.timelineVariable("startX2"),
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
    //TODO:  需要再次确认记录时间的位置，特别是对于同时呈现 
    response_start_time: () => Math.max(show_end_time1, show_end_time2),
    //结束时间，一共作答时间持续1500ms
    trial_duration: () => Math.max(show_end_time1, show_end_time2) + 1500,
    // on_start: generate_stim_condition, 
    data: function () { return jsPsych.timelineVariable("identify") },
    on_finish: function (data) {
      data.correct_response = jsPsych.timelineVariable("identify");
      data.correct = data.correct_response == data.key_press;//0错1对
      data.image = jsPsych.timelineVariable("image");
      data.word = jsPsych.timelineVariable("word");//加括号
      data.target = jsPsych.timelineVariable("target");
      data.valence = jsPsych.timelineVariable("valence");
      data.matchness = jsPsych.timelineVariable("matchness");
      data.exp_phase = exp_phase
      data.block_type = () => block_type[block_id]
      // console.log(
      //   "\nfinish-------------------------:\n",
      //   "startX1", startX1,
      //   "startX2", startX2,
      //   "show_start_time1", show_start_time1,
      //   "show_start_time2", show_start_time2
      // )
    }
  }
  let trial_feedback = {
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
  if (exp_phase = "Practice") trial_procedure.push(trial_feedback)

  /**----------------------
   *    单个block的定义
   *------------------------**/
  let block_timeline = {
    timeline: trial_procedure,
    timeline_variables: tb_tmp,
    randomize_order: true,
    repetitions: repetitions
  };

  let stim_length = tb_tmp.length * repetitions
  let block_feedback = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
      let trials = jsPsych.data.get().filter(
        [{ correct: true }, { correct: false }]
      ).last(stim_length); // 运行逻辑：先挑出data里的所有的correct：true/false的数据行，成为新的数组，然后对倒数的某几组进行计算
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

  /**----------------------
   *    练习阶段 vs. 正式实验
   *------------------------**/
  let loop_node
  if (exp_phase == "Practice") {
    let if_node = { //if_node 用于判断是否呈现feedback，feedback_continue_practice
      timeline: [block_feedback, feedback_continue_practice],
      conditional_function: function (data) {
        let trials = jsPsych.data.get().filter(
          [{ correct: true }, { correct: false }]
        ).last(stim_length);//记得改，取数据
        let correct_trials = trials.filter({
          correct: true
        });
        let accuracy = Math.round(correct_trials.count() / trials.count() * 100);
        if (accuracy >= prac_acc_thres) {
          return false;//达标就skip掉feedback_continue_practice这一段
        } else if (accuracy < prac_acc_thres) { //没达标反馈feedback,feedback_continue_practice
          return true;
        }
      }
    }
    loop_node = {
      timeline: [block_timeline, if_node],
      loop_function: function () {
        let trials = jsPsych.data.get().filter(
          [{ correct: true }, { correct: false }]
        ).last(stim_length);//记得改，取数据
        let correct_trials = trials.filter({
          correct: true
        });
        let accuracy = Math.round(correct_trials.count() / trials.count() * 100);
        if (accuracy >= prac_acc_thres) {
          return false;//end 进入正式实验前的反馈
        } else if (accuracy < prac_acc_thres) { // repeat
          return true;
        }
      }
    }
  } else {
    loop_node = { timeline: [block_timeline, block_feedback] }
  }
  return loop_node
};

let prac_session_generator = (repetitions = 1) => {

  let block_id = [0, 1, 2]
  block_id = jsPsych.randomization.shuffleNoRepeats(block_id)
  console.log('prac_block_id', block_id)


  let feedback_gow_generator = (block_type_i, bid, repetitions) => {
    let stim_length = tb[bid].length * repetitions
    return {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: function () {
        let trials = jsPsych.data.get().filter(
          [{ correct: true }, { correct: false }]
        ).last(stim_length);
        let correct_trials = trials.filter({
          correct: true
        });
        let accuracy = Math.round(correct_trials.count() / trials.count() * 100);
        let rt = Math.round(correct_trials.select('rt').mean());
        return "<style>.context{color:white; font-size: 35px; line-height:40px}</style>\
                          <div><p class='context'>您正确回答了" + accuracy + "% 的试次。</p>" +
          "<p class='context'>您的平均反应时为" + rt + "毫秒。</p>" +
          `<p class='context'>恭喜您完成这一阶段的练习。按任意键进入<span style='color: yellow;'>${block_type_i}</span>的练习。</p></div>"`
      },
      on_finish: function () {
        $("body").css("cursor", "none");
      }
    }
  }

  let loop_timeline = []
  block_id.forEach((bid, order) => {
    let loop_node = block_generator(bid, repetitions)
    if (order == 0) loop_timeline.push(Instructions1_generator(block_type[block_id[order]]))
    loop_timeline.push(loop_node)
    if (order < block_id.length - 1) loop_timeline.push(
      feedback_gow_generator(
        block_type[block_id[order + 1]],
        bid,
        repetitions
      )
    )
  })

  return { timeline: loop_timeline }
};


/**--------------------------------------------
 *               定义正式实验
 *---------------------------------------------**/
let formal_session_generator = (repetition_stim = 3, repetition_block = 4) => {

  let block_id = [0, 1, 2]
  block_id = jsPsych.randomization.shuffleNoRepeats(block_id)
  console.log('formal_block_id', block_id)

  let p_gotonext = (block_type_i) => {
    return {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
    <p>请您将手指放在按键上，准备进入呈现顺序为<span style='color: yellow;'>${block_type_i}</span>的正式匹配任务</p>
    <p> <div style = "color: green"><按任意键进入下一阶段的匹配任务></div></p>
    `,
      choices: "ALL_KEYS",
    }
  };
  let end_image = (block_type_i) => {
    return {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: `
    <p>恭喜您，正式实验中的呈现顺序为${block_type_i}条件已经完成。</p>
    <p> <div style = "color: green"><按任意键继续></div></p>
    `,
      choices: "ALL_KEYS",
    };
  };
  let rest_image = (blockTotalNum) => {
    return {
      type: jsPsychHtmlButtonResponse,
      stimulus: "",
      choices: ["结束休息"],
      on_start: function (data) {
        blockTotalNum -= 1;
        if (blockTotalNum == 0) {
          data.trial_duration = 5
          data.choices = [""]
          return
        }
        $("body").css("cursor", "default");
        let tmpTime = setInterval(function () {
          $("#iii").text(parseInt($("#iii").text()) - 1);
          if (parseInt($("#iii").text()) < 1) {
            $("#iii").parent().text("当前限定休息时间已到达，如果还未到达状态，请继续休息");
            clearInterval(parseInt(sessionStorage.getItem("tmpInter")));
          }
        }, 1000);
        sessionStorage.setItem("tmpInter", tmpTime);
        data.stimulus = `
                  <p>您当前还剩余${blockTotalNum}组实验</p>
                  <p>现在是休息时间，当您结束休息后，您可以点击 结束休息 按钮 继续</p>
                  <p>建议休息时间还剩余<span id="iii">60</span>秒</p>`
      },
      on_finish: function () {
        $("body").css("cursor", "none"); //鼠标消失
        $(document.body).unbind();
        clearInterval(parseInt(sessionStorage.getItem("tmpInter")));
      }
    }
  };

  let repeatblocks = []
  block_id.forEach((bid, order) => {
    // 生成 trials
    let loop_node = block_generator(bid, repetition_stim, "Formal")
    let block_type_i = block_type[block_id[order + 1]]
    // 加入 block 引入部分
    if (order < block_id.length - 1) repeatblocks.push(p_gotonext(block_type_i))
    // 加入 trials + 休息
    repeatblocks.push({
      timeline: [loop_node, rest_image(repetition_block)],
      repetitions: repetition_block //4个block
    })
    repeatblocks.push(end_image(block_type_i))
  })

  return { timeline: repeatblocks }
};

/**--------------------------------------------
 *               定义总的 timeline
 *---------------------------------------------**/

if (!test_mode) {
  timeline.push(welcome);
  timeline.push(basic_information);
  timeline.push(information);
  timeline.push(chinrest);
  timeline.push(fullscreen_trial);
}
timeline.push(prac_session_generator())
timeline.push(formal_session_generator(repetition_stim, repetition_block))

timeline.push(finish);
test_mode ? jsPsych.simulate(timeline, "visual", { default: { data: { rt: 500 } } }) : jsPsych.run(timeline);