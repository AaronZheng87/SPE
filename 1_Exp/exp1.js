const jsPsych = initJsPsych({
    /* auto_update_progress_bar: true,
     extensions: {
       type: naodao,
     }*/
     on_finish: function() {
      jsPsych.data.get().localSave('csv', 'exp1' + info["ID"] + '.csv'); 
      document.exitFullscreen(); // 退出全屏
      let bodyNode = document.getElementsByTagName("body"); // 获取Body窗体
            }
     });

var timeline = [] //设置一个时间线

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
timeline.push(welcome);

jsPsych.run(timeline);