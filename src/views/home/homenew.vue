<template>
    <div class="main">
        <!-- <div class="head">
            <topNavigation color="#fff" scroll :displaySearch="true"></topNavigation>
        </div> -->
        <div class="cover-picture">
        </div>
        <div class="header-channel">
        <!-- 左边部分 -->
        <div class="header-channel-left">
        <div class="channel-left-item">
            <div class="channel-left-icon bg-orange">
            <SvgIcon name="dynamic" class="icon" color="#fff"></SvgIcon>
            </div>
            <div class="channel-left-item-title">动态</div>
        </div>
        <div class="channel-left-item">
            <div class="channel-left-icon bg-pink">
            <SvgIcon name="flame" class="icon" color="#fff"></SvgIcon>
            </div>
            <div class="channel-left-item-title">热门</div>
        </div>
        <div class="channel-left-item">
            <div class="channel-left-icon bg-green">
            <SvgIcon name="channel" class="icon" color="#fff"></SvgIcon>
            </div>
            <div class="channel-left-item-title">频道</div>
        </div>
        </div>
        <!-- 中间部分 -->
        <div class="header-channel-right">
            <!-- 此部分窄屏不可见 -->
            <div class="channel-right-box-left">
                <div class="right-box-left-item" v-for="item in 12">
                番剧
                </div>
            </div>

            <div class="channel-right-box-right">
                <div class="right-box-right-item" v-for="sideMavigationItem in sideMavigation">
                <SvgIcon :name="sideMavigationItem.iconName" class="icon" color="#61666D"></SvgIcon>
                <span class="channel-text">{{ sideMavigationItem.title }}</span>
                </div>
            </div>
        </div>

    </div>
        <div class="video-list" :infinite-scroll-distance="770" v-infinite-scroll="scrollBottom" :record-empty="40"
        :infinite-scroll-delay="1000" :infinite-scroll-immediate="false">
        <!-- 视频 -->
        <!-- 视频骨架屏 -->
        <div class="video-card" v-for="(videoInfo, index) in videoList.length ? videoList : quickCreationArr(11)"
            :key="videoInfo.id">
            <el-skeleton style="width: 100%; height: 13rem;" :loading="!videoInfo.id" animated>
            <template #template>
                <el-skeleton-item variant="text" style="  width: 100%;height: 100%;" />
                <div style="text-align: start; margin-top: 0.6rem;">
                <el-skeleton-item variant="h3" style="width: 100%" />
                <div>
                    <el-skeleton-item variant="h3" style="width: 80%" />
                    <el-skeleton-item variant="h3" style="width: 60%" />
                </div>
                </div>
            </template>
            <template #default>
                <div class="item">
                    <div class="head">
                        <div class="item-image" :style="{ backgroundImage: `url(${videoInfo.cover})` }"></div>
                        <div class="classification">
                            <div class="classification-left">
                                <span class="play-volume">
                                    <SvgIcon name="video" class="icon" color="#fff"></SvgIcon>
                                    <span>{{ videoInfo.heat }}</span>
                                </span>
                                <span class="barrage-number">
                                    <SvgIcon name="barrageNumber" class="icon" color="#fff"></SvgIcon>
                                    <span>{{ videoInfo.barrageNumber }}</span>
                                </span>
                            </div>
                            <div class="classification-right">
                                <span>{{ formattingSecondTime(videoInfo.video_duration) }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="info">
                        <div class="video-title">
                            <VueEllipsis3 :text="videoInfo.title" :visibleLine="1" />
                        </div>
                        <div class="video-information">
                            <SvgIcon name="up" class="icon" color="#999"></SvgIcon>
                            <span class="video-information-username">{{ videoInfo.username }} </span> <span
                                class="video-information-time">·
                                {{ timestampFormat(videoInfo.created_at) }}</span>
                        </div>
                    </div>
                </div>
            </template>
            </el-skeleton>
        </div>
        </div>
    </div>
    
</template>

<script setup lang="ts">
import { getHomeInfo } from "@/apis/home";
// import topNavigation from "@/components/topNavigation/topNavigation.vue";
import { VueEllipsis3 } from 'vue-ellipsis-3';
import globalScss from "@/assets/styles/global/export.module.scss";
import { GetHomeInfoReq, GetHomeInfoRes, VideoInfo } from "@/types/home/home";
import { Ref, UnwrapNestedRefs, computed, onMounted, reactive, ref } from "vue";
import { formattingSecondTime, timestampFormat } from "@/utils/conversion/timeConversion";

// value
const pageInfo = reactive(<GetHomeInfoReq>{
  page_info: {
    page: 1,
    size: 15,
  }
})


let homeInfo = ref<GetHomeInfoRes>({
  rotograph: [],
  videoList: []
})

const sideMavigation = reactive([
  { iconName: "columnInformation", title: "专栏" },
  { iconName: "liveStreamPlayer", title: "直播" },
  { iconName: "flag", title: "活动" },
  { iconName: "classroom", title: "课堂" },
  { iconName: "chatList", title: "消息列表" },
  { iconName: "music", title: "听首曲子" },
])

// methods
const videoList = computed(() => {
  let list = [] as Array<VideoInfo>
  //判断当前页面数量 为第二页
  if (pageInfo.page_info.page == 2) {
    if (homeInfo.value.videoList.length % 11 == 0) {
      list = [...list, ...homeInfo.value.videoList, ...quickCreationArr(15)]
      //并且加载数据
      loadData(homeInfo, pageInfo)
    } else {
      list = [...homeInfo.value.videoList]
    }
  } else if (pageInfo.page_info.page > 2) {
    if ((homeInfo.value.videoList.length - 11) % pageInfo.page_info.size == 0) {
      list = [...list, ...homeInfo.value.videoList, ...quickCreationArr(15)]
    } else {
      list = [...homeInfo.value.videoList]
    }
  } else {
    list = [...homeInfo.value.videoList]
  }

  return list
})


//生成占位骨架屏
const quickCreationArr = (num: number): Array<VideoInfo> => {
  let arr = []
  for (let i = 0; i < num; i++) {
    arr.push(<VideoInfo>{
    })
  }
  return arr
}

const loadData = async (homeInfo: Ref<GetHomeInfoRes>, pageInfo: UnwrapNestedRefs<GetHomeInfoReq>) => {
  const response = await getHomeInfo(pageInfo)
  if (!response.data) return
  console.log(response.data)
  homeInfo.value.rotograph = response.data.rotograph
  console.log(homeInfo.value)
  homeInfo.value.videoList = [...homeInfo.value.videoList, ...response.data.videoList]
  //请求成功后下次分页+1
  pageInfo.page_info.page = pageInfo.page_info.page + 1
}

//加载底部
const scrollBottom = () => {
  console.log("触底")
  //无数据时取消加载更多
  if (homeInfo.value.videoList.length <= 0) return false
  loadData(homeInfo, pageInfo)

}

onMounted(() => {
  loadData(homeInfo, pageInfo)
})
</script>

<style scoped lang="scss">
.main {
    height: 100%;
    text-align: centers;

    .head {
        position: fixed;
        z-index: 1;
        top: 0;
        width: 100%;
    }

    .cover-picture {
        width: 100%;
        height: 12rem;
        color: #fff;
        background-image: url("@/assets/img/home/background.png");
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        display: flex;
        align-items: center;
        padding: 0;
        border: 0;
        overflow: hidden;
        background-position: center center;
        background-size: cover;
        transform: translate3d(0px, 0px, 0px);
    }



    .header-channel {
        // width: 100%;
        // padding-top: 24px;
        // padding: 20px 140px 0px 140px;
        display: flex;

        .header-channel-left {
            display: flex;

            .channel-left-item {
                margin-right: 24px;

                .channel-left-icon {
                    //图标大小要调
                    width: 46px;
                    height: 46px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .icon {
                    width: 29px;
                    height: 29px;
                }

            }

            .channel-left-item-title {
                margin-top: 6px;
                text-align: center;
                //字体要跟随图标调整
                font-size: 14px;
                line-height: 20px;
            }

            .bg-orange {
                background-color: #ff9212;
            }

            .bg-pink {
                background-color: #f07775;
            }

            .bg-green {
                background-color: #59ca73;
            }
        }

        .header-channel-right {
            display: flex;
            width: 100%;

            .channel-right-box-left {
                padding-right: 30px;
                display: grid;
                width: 100%;
                grid-auto-flow: column;
                grid-column: span 4;
                grid-gap: 10px;
                grid-template-rows: repeat(2, 1fr);
                // grid-template-columns: repeat(12, 1fr);
                border-right: 1px solid #E3E5E7;

                .right-box-left-item {
                    font-size: 14px;
                    font-weight: 100;
                    display: inline-block;
                    box-sizing: content-box;
                    width: 100%;
                    min-width: 3rem;
                    height: 32px;
                    line-height: 32px;
                    border: 1px solid #F1F2F3;
                    border-radius: 6px;
                    background-color: #F6F7F8;
                    color: #61666D;
                    text-align: center;
                    font-weight: 400;
                    transition: background-color .3s, color .3s;
                }
            }

            .channel-right-box-right {
                padding-left: 20px;
                display: grid;
                width: 20%;
                grid-auto-flow: column;
                grid-column: span 4;
                grid-gap: 10px;
                grid-template-rows: repeat(2, 1fr);

                .right-box-right-item {
                    font-size: 14px;
                    color: #61666D;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    .icon {
                        width: 20px;
                        height: 20px;
                    }

                    .channel-text {
                        white-space: pre;
                    }
                }
            }
        }
    }
    
    @media (max-width: 768px) {

        .header-channel {
            width: 100%;
            padding-top: 24px;
            padding: 20px 40px 0px 40px;

            .header-channel-right {
                .channel-right-box-left {
                    display: none;
                }
            }
        }
        .video-list {
            text-align: center;
            width: 100%;
            padding-top: 24px;
            // 调节边框
            padding: 20px 40px 0px 40px;
            display: grid;
            grid-gap: 20px; 
            grid-column: span 5;
            grid-template-columns: 100%;
        }
    }

    @media screen and (min-width: 767px) and (max-width: 2560px) {
        .header-channel {
            width: 100%;
            padding-top: 24px;
            padding: 20px 60px 0px 60px;
            
        }
        .video-list {
            text-align: center;
            width: 100%;
            // padding-top: 24px;
            // padding: top right buttom left
            padding: 20px 60px 0px 60px;
            display: grid;
            // grid-gap: 20px; 
            grid-gap: 3vw;
            // grid-column: span 5;
            grid-template-columns: repeat(2, 1fr);
        }
    }

    .video-list {
        .video-card {
            width: 100%;
            height: 100%;

            .item {
                // height: 13rem; 
                width: 100%;
                height: 100%;

                /* 聚焦属性*/
                .change {
                    z-index: 5;
                }

                .head {
                    position: relative;

                    :deep(.el-image) {
                        width: 100%;
                        height: 80%;
                    }

                    .item-image {
                        width: 100%;
                        // 长宽比 3:2
                        aspect-ratio: 3/2;
                        // height: 100%;
                        background-size: 100% 100%;
                        border-radius: 6px;
                    }

                    .classification {
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        height: 30px;
                        width: 100%;
                        z-index: 1;
                        background-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, .32) 100%);
                        // padding: 0px 0px 0px 6px;
                        text-indent: 10px;
                        font-size: 12px;
                        color: #fff;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        border-radius: 6px;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        .icon {
                            width: 20px;
                            height: 20px;
                        }

                        .classification-left {
                            flex: 1;
                            margin-left: 10px;
                            display: flex;

                            .play-volume {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                margin-right: 6px;
                            }

                            .barrage-number {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                            }
                        }

                        .classification-right {
                            margin-right: 10px;
                        }

                    }
                }



                .info {
                    margin-top: 0.5vw;
                    height: 6vw;
                    // display: flex;
                    align-items: center;

                    .video-title {
                        //可以在这里使用响应式
                        line-height: 4cqw;
                        font-size: 2cqw;
                        // 两行还是一行最后确定
                        // height: calc(2 * 4cqw);
                        color: #18191C;
                        text-align: start;

                    }

                    .video-information {
                        margin-top: 0.5vw;
                        display: flex;
                        align-items: center;

                        .video-information-username {
                            color: rgb(148, 153, 160);
                            //字体大小变化不正常
                            font-size: 0.9cqw;
                            margin-left: 0.5vw;
                        }

                        .video-information-time {
                            color: rgb(148, 153, 160);
                            font-size: 0.8cqw;
                            margin-left: 0.5vw;
                        }
                    }

                    .icon {
                        width: 15px;
                        height: 12px;
                    }

                }

            }
        }
    
    }
}

</style>