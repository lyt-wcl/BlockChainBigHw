import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import List from '../List'
import './index.css'

export default class Body extends Component {
  constructor(props) {
    super(props);
    this.state.proposals.push({ id: 1, title: '奥斯迪阿苏大叔大婶奥术大师大所大所大所大所大所多奥术大师大所大所大所大所大所多奥术大师大所大所多', proposer: '奥斯迪阿苏大叔大婶奥术大师大所大所大所大所大所多奥术大师大所大所大所大所大所多奥术大师大所大所多', detail: "奥斯迪阿苏大叔大婶奥术大师大所大所大所大所大所多奥术大师大所大所大所大所大所多奥术大师大所大所多", start_time: 223, agree_num: 123, disagree_num: 213, is_vote: 0 });
    this.state.proposals.push({ id: 2, title: '123', proposer: '1234', detail: "12312", start_time: 123, agree_num: 123, disagree_num: 213, is_vote: 0 });
    // TODO 从链上读取积分
    // TODO 从链上读取提案列表
  }

  state = {
    points: 10,
    is_proposaling: false,
    proposals: [],
  }

  user_addr = 0x0;

  checkin = () => {
    const { points } = this.state;
    // TODO 更新链上的积分
    if (this.user_addr === 0x0) {
      alert("请先登录");
      return;
    }

    this.setState({ points: points + 3 });
  }

  changeProposalState = () => {
    const { is_proposaling, points } = this.state;

    if (this.user_addr === 0x0) {
      alert("请先登录");
      return;
    }
    if (!is_proposaling && points < 3) {
      alert("积分不足! 发起提案需要3点积分");
      return;
    }

    this.setState({ is_proposaling: !is_proposaling });
    this.form_title.value = "";
    this.form_detail.value = "";
  }

  submit = () => {
    const { points } = this.state;
    const { form_title: { value: title }, form_detail: { value: detail } } = this;

    if (title === "") {
      alert("提案标题不能为空");
      return;
    }
    if (detail === "") {
      alert("提案详情不能为空");
      return;
    }
    if (window.confirm("您确定要花费3积分发起提案吗")) {
      // TODO 将新提案写入区块链

      this.state.proposals.push({ id: 3, title: title, proposer: '1234', detail: detail, start_time: 223, agree_num: 123, disagree_num: 213, is_vote: 0 });

      this.setState({ is_proposaling: false, points: points - 3 });
    }

  }

  vote = (choice, id) => {
    const { points, proposals } = this.state;
    return () => {
      if (this.user_addr === 0x0) {
        alert("请先登录");
        return;
      }
      if (points < 1) {
        alert("积分不足! 投票需要1点积分");
        return;
      }
      for (let proposal of proposals) {
        if (proposal.id === id) {
          if (proposal.start_time > 300) return; // 已超时
          proposal.is_vote = choice ? 1 : 2;
          if (choice === true) proposal.agree_num++;
          else proposal.disagree_num++;
          // TODO map[id][choic ? 1 : 0].push(msg.sender)
        }
      }
      this.setState({ proposals, points: points - 1 });
    };
  }

  componentDidMount() {
    if (this.user_addr === 0x0) {
      PubSub.subscribe("user_addr", (_, { user_addr }) => {
        this.user_addr = user_addr;
      });
    }
  }
  
  render() {
    const { points, is_proposaling: isProposaling, proposals } = this.state;
    return (
      <div className='body'>
        
        <List points={points} proposals={proposals} vote={this.vote} />
        <ul className='menu'>
          <li>你有{points}积分,每次发起提案消耗3积分，投票消耗1积分，提案通过获得10积分</li>
        </ul>
        <div id='signIn'><button onClick={this.checkin} id='signInBtn'>每日签到</button></div>
        <div id='signIn'>
        <button onClick={this.changeProposalState} id='signInBtn'>{isProposaling ? "取消发起" : "发起提案"}</button>
          </div>
        
        
        <form className='proposal-form' style={{ display: isProposaling ? 'block' : 'none' }}>
          <ul>
            <li>
              <label htmlFor="proposal-topic" id='proposal_title'>标题: </label>
              <input type="text" id="proposal-topic" ref={c => this.form_title = c} placeholder='请输入提案标题' />
            </li>
            <li>
              <label htmlFor="proposal-detail" id='proposal_title'>详情: </label>
              <textarea id="proposal-detail" ref={c => this.form_detail = c} placeholder='请输入提案详情'></textarea>
            </li>
            <li className='clearfix'>
              <input type="submit" onClick={this.submit} />
            </li>
          </ul>
        </form>
      </div>
    )
  }
}
