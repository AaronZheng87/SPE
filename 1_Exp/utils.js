// 自定义函数
function permutation(arr, num) { //定义排列组合的function
  var r = [];
  (function f(t, a, n) {
    if (n == 0) return r.push(t);
    for (var i = 0, l = a.length; i < l; i++) {
      f(t.concat(a[i]), a.slice(0, i).concat(a.slice(i + 1)), n - 1);
    }
  })([], arr, num);
  return r;
}



/* basic data collection jsPsychInstructions trial 被试基本信息收集 */
SUBJ_INFO = []
var basic_info_instru_generator = () => {
  let timeline = {
    // 实验被试信息收集
    timeline: [
      // 提醒
      {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
      <p>本实验首先需要您填写一些基本个人信息。</p>
      <p> <div style = "color: green"><按任意键至下页></div></p>
      `,
        choices: "ALL_KEYS",
      },
      //探测被试显示器数据
      {
        type: jsPsychCallFunction,
        func: function () {
          if ($(window).outerHeight() < 500) {
            alert("您设备不支持实验，请进入全屏模式。若已进入全屏，请换一台高分辨率的设备，谢谢。");
            window.location = "";
          }
        }
      },
      // 记录实验编号
      {
        type: jsPsychSurveyHtmlForm,
        preamble: "<p style =' color : white'>您的实验编号是</p>",
        html: function () {
          let data = localStorage.getItem(SUBJ_INFO["subj_idx"]) ? JSON.parse(localStorage.getItem(SUBJ_INFO["subj_idx"]))["Name"] : "";
          return "<p><input name='Q0' type='text' value='" + data + "' required/></p>";
        },
        button_label: "继续",
        on_finish: function (data) {
          SUBJ_INFO["ID"] = data.response.Q0;
        }
      },
      // 记录性别
      {
        type: jsPsychHtmlButtonResponse,
        stimulus: "<p style = 'color : white'>您的性别</p>",
        choices: ['男', '女', '其他'],
        on_finish: function (data) {
          SUBJ_INFO["Sex"] = data.response == 0 ? "Male" : (data.response == 1 ? "Female" : "Other")
        }
      },
      // 记录年龄
      {
        type: jsPsychSurveyHtmlForm,
        preamble: "<p style = 'color : white'>您的出生年</p>",
        html: function () {
          let data = localStorage.getItem(SUBJ_INFO["subj_idx"]) ? JSON.parse(localStorage.getItem(SUBJ_INFO["subj_idx"]))["BirthYear"] : "";
          return `<p>
      <input name="Q0" type="number" value="${data}" placeholder="1900~2023" min=1900 max=2023 oninput="if(value.length>4) value=value.slice(0,4)" required />
      </p>`
        },
        button_label: '继续',
        on_finish: function (data) {
          SUBJ_INFO["BirthYear"] = data.response.Q0;
        }
      },
      // 教育经历
      {
        type: jsPsychSurveyHtmlForm,
        preamble: "<p style = 'color : white'>您的教育经历是</p>",
        html: function () {
          return `
              <p><select name="Q0" size=10>
              <option value=1>小学以下</option>
              <option value=2>小学</option>
              <option value=3>初中</option>
              <option value=4>高中</option>
              <option value=5>大学</option>
              <option value=6>硕士</option>
              <option value=7>博士</option>
              <option value=8>其他</option>
              </select></p>`
        },
        on_load: function () {
          $("option[value=" + (["below primary school", "primary school", "junior middle school", "high school", "university", "master", "doctor", "other"].indexOf(localStorage.getItem(SUBJ_INFO["subj_idx"]) ? JSON.parse(localStorage.getItem(SUBJ_INFO["subj_idx"]))["Education"] : "") + 1) + "]").attr("selected", true);
        },
        button_label: '继续',
        on_finish: function (data) {
          let edu = ["below primary school", "primary school", "junior middle school", "high school", "university", "master", "doctor", "other"];
          SUBJ_INFO["Education"] = edu[parseInt(data.response.Q0) - 1];
        }
      }
    ]
  };
  return timeline
};


// 根据被试编号，打乱实验数据
TEXT_IMAGE_PAIRS = "";
var shuffle_stim = (info_id) => {
  /* shuffle images order
  Args: info_id = info["ID"]
  Returns: 
     TEXT_IMAGE_PAIRS list: list of html description
  */

  let subj_id = info_id ? info_id : Math.random().toFixed(4) * 10000;
  // console.log(' subj_id', subj_id)
  word = permutation(texts, 3) //对应的文字
  texts = word[parseInt(subj_id) % 6] //被试id除以6，求余数
  key = permutation(key, 2)[parseInt(subj_id) % 2] //对应的按键

  //指导语中呈现的图片和文字对应关系
  jsPsych.randomization.shuffle(images).forEach((v, i) => { //将image随机
    TEXT_IMAGE_PAIRS += `<p class="content"><img src="${v}" width=150 style="vertical-align:middle">---${texts[images.indexOf(v)]}</p>`; //image编号和文字对应
  })
  // console.log('TEXT_IMAGE_PAIRS', TEXT_IMAGE_PAIRS)
  console.log(
    `
    /**----------------------
     *    注意：已经修改全局变量，key，images，texts, TEXT_IMAGE_PAIRS
     *------------------------**/
    `
  );
  console.log(`match : ${key[0]}; \nmismatch : ${key[1]};`)
  console.log(images.map((v, i) => v.slice(-12, -4) + ", " + texts[i]).join("\n"));
};

var welcome = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
     <p>您好，欢迎参加本次实验。</p>
     <p>为充分保障您的权利，请确保您已经知晓并同意《参与实验同意书》以及《数据公开知情同意书》。</p>
     <p>如果您未见过上述内容，请咨询实验员。</p>
     <p>如果您选择继续实验，则表示您已经清楚两份知情同意书的内容并同意。</p>
     <p> <div style = "color: green"><按任意键至下页></div> </p>
     `,
  choices: "ALL_KEYS",
};

var chinrest = {
  type: jsPsychVirtualChinrest,
  blindspot_reps: 3,
  resize_units: "deg",
  pixels_per_unit: 50,
  item_path: '3_Stimuli/card.png',
  adjustment_prompt: function () {
    let html = `<p style = "font-size: 28px">首先，我们将快速测量您的显示器上像素到厘米的转换比率。</p>`;
    html += `<p style = "font-size: 28px">请您将拿出一张真实的银行卡放在屏幕上方，单击并拖动图像的右下角，直到它与屏幕上的信用卡大小相同。</p>`;
    html += `<p style = "font-size: 28px">您可以使用与银行卡大小相同的任何卡，如会员卡或驾照，如果您无法使用真实的卡，可以使用直尺测量图像宽度至85.6毫米。</p>`;
    html += `<p style = "font-size: 28px"> 如果对以上操作感到困惑，请参考这个视频： <a href='https://www.naodao.com/public/stim_calibrate.mp4' target='_blank' style='font-size:24px'>参考视频</a></p>`;
    return html
  },
  blindspot_prompt: function () {
    return `<p style="text-align:left">现在，我们将快速测量您和屏幕之间的距离：<br>
    请把您的左手放在 空格键上<br>
    请用右手遮住右眼<br>
    请用您的左眼专注于黑色方块。将注意力集中在黑色方块上。<br>
    如果您已经准备好了就按下 空格键 ，这时红色的球将从右向左移动，并将消失。当球一消失，就请再按空格键<br>
    如果对以上操作感到困惑，请参考这个视频：<a href='https://www.naodao.com/public/stim_calibrate.mp4' target='_blank' style='font-size:24px'>参考视频</a><br>
    <a style="text-align:center">准备开始时，请按空格键。</a></p>`
  },
  blindspot_measurements_prompt: `剩余测量次数：`,
  on_finish: function (data) {
    console.log(data)
  },
  redo_measurement_button_label: `还不够接近，请重试`,
  blindspot_done_prompt: `是的`,
  adjustment_button_prompt: `图像大小对准后，请单击此处`,
  viewing_distance_report: `<p>根据您的反应，您坐在离屏幕<span id='distance-estimate' style='font-weight: bold;'></span> 的位置。<br>这大概是对的吗？</p> `,
};


var fullscreen_trial = {
  type: jsPsychFullscreen,
  fullscreen_mode: true,
  message: "<p><span class='add_' style='color:white; font-size: 25px;'> 实验需要全屏模式，实验期间请勿退出全屏。 </span></p >",
  button_label: " <span class='add_' style='color:black; font-size: 20px;'> 点击这里进入全屏</span>"
}

var Instructions1_generator = (time_consumption = 40, add_pages, load_callback, finish_callback) => {

  return {
    type: jsPsychInstructions,
    pages: () => {

      if (load_callback) load_callback();

      let pages = []
      let start = "<p class='header' style = 'font-size: 25px'>请您记住如下对应关系:</p>",
        end = "<p class='footer'  style = 'font-size: 25px'>如果对本实验还有不清楚之处，请立即向实验员咨询。</p>";

      pages.push(
        `<p class='header' style = 'font-size: 25px'>实验说明：</p><p style='color:white; font-size: 25px;line-height: 30px;'>您好，欢迎参加本实验。本次实验大约需要${time_consumption}分钟完成。</p><p style='color:white; font-size: 25px;'>在本实验中，您需要完成一个简单的知觉匹配任务。</p><p style='color:white; font-size: 25px;'>您将学习几种几何图形与不同标签的对应关系。</p>
        `
      )
      let tmpI = () => TEXT_IMAGE_PAIRS;

      pages.push(
        start + `<div class="box">${tmpI()}</div>` +
        `<p class='footer' style='font-size: 30px; line-height: 35px;'>您的任务是在不同图形和文字呈现顺序的条件下判断几何图形与图形名称或文字标签是否匹配，</p><p class='footer' style='color:white; font-size: 25px;'>如果二者匹配，请按<span style="color: lightgreen; font-size:25px">${key[0]}键</span></p><p class='footer' style='color:white; font-size: 25px;'>如果二者不匹配，请按<span style="color: lightgreen; font-size:25px"> ${key[1]}键</p></span><p class='footer' style='color:white; font-size: 20px;'>请在实验过程中将您的<span style="color: lightgreen;">食指</span>放在电脑键盘的相应键位上准备按键。</p></span>`
      )

      pages.push(end)
      if (add_pages) pages.push(...add_pages());

      return pages;
    },
    show_clickable_nav: true,
    button_label_previous: " <span class='add_' style='color:black; font-size: 20px;'> 返回</span>",
    button_label_next: " <span class='add_' style='color:black; font-size: 20px;'> 继续</span>",
    on_load: () => {
      $("body").css("cursor", "default");  //鼠标消失术，放在要消失鼠标的前一个事件里
    },
    on_finish: function () {
      if (finish_callback) finish_callback();
      $("body").css("cursor", "none");    //鼠标消失术，放在要消失鼠标的前一个事件里
    }
  }
};

// 基本变量声明
var timeline = [] //设置一个时间线


var feedback_continue_practice = { //在这里呈现文字recap，让被试再记一下
  type: jsPsychInstructions,
  pages: function () {
    let start = "<p class='header' style='font-size:25px; line-height:30px;'>请您努力记下如下匹配对应关系，再次进行练习。</p>",
      middle = "<p class='footer' style='font-size:25px; line-height:30px;'>如果对本实验还有不清楚之处，请立即向实验员咨询。</p>",
      end = "<p style='font-size:25px; line-height:30px;'>如果您明白了规则：</p><p style='font-size:22px; line-height:25px;'>请按 继续 进入练习</p><div>";
    let tmpI = "";
    TEXT_IMAGE_PAIRS.forEach(v => {
      tmpI += `<p class="content" style='font-size:25px'>${v}</p>`;
    });
    return ["<p class='header' style='font-size:25px; line-height:30px;'>您的正确率未达到进入正式实验的要求。</p>",
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


var feedback_goformal = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    let trials = jsPsych.data.get().filter(
      [{ correct: true }, { correct: false }]
    ).last(24);
    let correct_trials = trials.filter({
      correct: true
    });
    let accuracy = Math.round(correct_trials.count() / trials.count() * 100);
    let rt = Math.round(correct_trials.select('rt').mean());
    return "<style>.context{color:white; font-size: 35px; line-height:40px}</style>\
                          <div><p class='context'>您正确回答了" + accuracy + "% 的试次。</p>" +
      "<p class='context'>您的平均反应时为" + rt + "毫秒。</p>" +
      "<p class='context'>恭喜您完成练习。按任意键进入正式实验。</p>" +
      "<p class='footer' style='font-size: 35px; line-height:40px;'>请在进入正式实验实验之前将您的<span style='color: lightgreen;'>食指</span>放在电脑键盘的相应键位上进行按键。</p>"
  },
  on_finish: function () {
    $("body").css("cursor", "none");
  }
}


let rest1 = {
  type: jsPsychHtmlButtonResponse,
  stimulus: "",
  choices: ["结束休息"],
  on_start: function (data) {
    blockTotalNum1 -= 1;
    if (blockTotalNum1 == 0) {
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
                  <p>您当前还剩余${blockTotalNum1}组实验</p>
                  <p>现在是休息时间，当您结束休息后，您可以点击 结束休息 按钮 继续</p>
                  <p>建议休息时间还剩余<span id="iii">60</span>秒</p>`
  },
  // on_load: function () {
  //   $("body").css("cursor", "default");
  //   let tmpTime = setInterval(function () {
  //     $("#iii").text(parseInt($("#iii").text()) - 1);
  //     if (parseInt($("#iii").text()) < 1) {
  //       $("#iii").parent().text("当前限定休息时间已到达，如果还未到达状态，请继续休息");
  //       clearInterval(parseInt(sessionStorage.getItem("tmpInter")));
  //     }
  //   }, 1000);
  //   sessionStorage.setItem("tmpInter", tmpTime);
  // },
  on_finish: function () {
    $("body").css("cursor", "none"); //鼠标消失
    $(document.body).unbind();
    clearInterval(parseInt(sessionStorage.getItem("tmpInter")));
  }
}


var finish = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
  <p>感谢您参加我们的实验，请<span style="color: yellow;">按任意键开始上传数据</span>，并通知研究者。</p>
  <p>感谢您的配合！</p>`,
  choices: "ALL_KEYS",
};

let fixation = (start = 500, end = 1000) => {
  return {
    obj_type: 'cross',
    startX: "center", // location of the cross's center in the canvas
    startY: "center",
    line_length: 40,
    line_width: 5,
    line_color: 'white', // You can use the HTML color name instead of the HEX color.
    show_start_time: start,
    show_end_time: end// ms after the start of the trial}
  }
};


