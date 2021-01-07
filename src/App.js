import React from 'react'
import axios from 'axios'
import { Pagination } from 'antd'
import 'antd/dist/antd.css'
import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

      tabs: [],
      items: [],
      tabItems: [],
      pageSize: 4,
      currentPage: 1,
      total: 0,
      showingItems: [],
      currentItem: {}
    }
    this.handleTabClick = this.handleTabClick.bind(this)
    this.handlePagination = this.handlePagination.bind(this)
    this.handleItemClick = this.handleItemClick.bind(this)
    this.handleCloseModal = this.handleCloseModal.bind(this)
  }

  componentDidMount() {
    this.getData()
  }


  async getData() {

    const tabsRes = await axios.get('https://www.jbo69.com/cms/json/JBO_promo_list.json')
    const itemsRes = await axios.get('https://www.jbo69.com/cms/json/JBO_promo_CNY.json')

    this.setState({
      tabs: tabsRes.data,
      items: itemsRes.data,
      currentCategoryId: 0
    })
    this.handleTabClick({ categoryId: 0 })
  }

  handleTabClick(tab) {
    const tabItems = tab.categoryId === 0
      ? this.state.items
      : this.state.items.filter(item => item.category.includes(tab.categoryId + ''))
    console.log(tabItems)
    this.setState({
      currentCategoryId: tab.categoryId,
      tabItems,
      currentPage: 1,
      total: tabItems.length
    }, () => {
      this.handlePagination(1, this.state.pageSize)
    })
  }

  handleItemClick(item) {
    this.setState({
      modalVisible: true,
      currentItem: item
    })
  }

  handleCloseModal() {
    this.setState({
      modalVisible: false
    })
  }

  handlePagination(page, pageSize) {
    this.setState({
      currentPage: page,
      showingItems: this.state.tabItems.slice((page - 1) * pageSize, page * pageSize)
    })
  }

  render() {
    const { tabs, currentCategoryId, showingItems, currentPage, pageSize, total, modalVisible, currentItem } = this.state
    const numPages = Math.ceil(total / pageSize)
    const all = [
      {
        resourcesName: '全部',
        categoryId: 0
      },
      ...tabs
    ]
    return (
      <div className="App">
        <div className="title">Frontend Developer Test</div>
        <div className="tabs">
          {all.map(tab => {
            return <Tab tab={tab} isActive={currentCategoryId === tab.categoryId} key={tab.categoryId} onClick={this.handleTabClick} />
          })}
        </div>
        <div className="container">
          {
            showingItems.map((item, index) => {
              return <Item item={item} key={index} onClick={this.handleItemClick} />
            })
          }
        </div>
        <div className="bottom">
          <Pagination current={currentPage} pageSize={pageSize} total={total} onChange={this.handlePagination} />
          <div className="right">共{numPages}页，{total}个优惠</div>
        </div>
        {
          modalVisible
            ?
            <div className="modal">
              <iframe src={currentItem.modalHtml} title="modal"></iframe>
              <div className="close" onClick={this.handleCloseModal}>X</div>
            </div>
            :
            null
        }
      </div>
    )
  }
}

function Tab(props) {
  const { tab, isActive } = props
  return (
    <div className={['tab' + (isActive ? ' active' : '')]} onClick={() => props.onClick(tab)}>
      {tab.resourcesName}
    </div>
  )
}

function Item(props) {
  const { item } = props
  return (
    <div className="item" onClick={() => props.onClick(item)}>
      <img src={item.thumbnail} alt="" />
    </div>
  )
}


export default App;
