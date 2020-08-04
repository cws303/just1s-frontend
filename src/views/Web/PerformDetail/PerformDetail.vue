<template>
  <div id="view-perform-detail">
    <div class="container-paper" v-if="perform.deck">
      <div class="text-subtitle">{{perform.createdAt | moment("YYYY년 M월") }}</div>
      <div class="row-title">
        <div class="class">제 1교시</div>
        <div class="title">{{perform.deck.title}}</div>
        <div class="row-name">
          <div class="text-name">성명</div>
          <div class="name" v-if="perform.user">{{perform.user.name}}</div>
        </div>
      </div>
      <div class="line-title"></div>
      <div class="col-answer">
        <span>다음 노래 제목을 적어주세요. ( 총 {{perform.answers.length}}문항 )</span>
        <div class="answer-wrapper" v-for="(answer, index) in perform.answers" :key="index">
          <div>
            <span class="index">{{index+1}}. {{answer.deckMusic.music.title}}</span>
            <span v-if="answer.isCorrect">({{answer.answer}})</span>
            <span v-if="!answer.isCorrect">
              <span style="color:red;text-decoration:line-through">
                <span style="color:#333">({{answer.answer}})</span>
              </span>
            </span>
          </div>
          <youtube-player
            :video-id="answer.deckMusic.music.key"
            width="240"
            height="135"
            ref="youtube"
          ></youtube-player>
        </div>
      </div>
    </div>

    <div class="row-home">
      <div class="btn-home" to="/">다른 문제 풀기</div>
    </div>
  </div>
</template>

<script>
import * as axios from "axios";
import { mapState } from "vuex";
export default {
  name: "PerformDetail",
  data() {
    return {
      msg: "PerformDetail",
      perform: {
        user: {},
      },
    };
  },
  methods: {
    async getOldOne(id) {
      const res = await this.$httpService.get("/performs/" + id);
      if (!res.data) {
        throw Error();
      }
      this.perform = res.data;

      this.perform.score =
        (this.perform.answers.filter((answer) => answer.isCorrect === true)
          .length /
          this.perform.answers.length) *
        100;
    },
  },
  created() {
    const performId = this.$route.params.id;
    if (performId) {
      this.getOldOne(performId).catch((e) => {
        console.log(e);
        alert("데이터를 가져오는데 실패했습니다");
        // this.$router.push({ name: "Home" });
      });
    }
  },
  computed: mapState(["currentUser"]),
};
</script>

<style lang="scss" scoped>
#view-perform-detail {
  @include view-root;

  .container-paper {
    background-color: #eee;
    display: flex;
    flex-direction: column;
    align-items: center;

    @include desktop {
      padding: 10px;
      margin: auto;
      max-width: 600px;
    }
    @include mobile {
      padding: vw-base(20px);
    }

    .row-title {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .class {
        border: 1px solid black;
        @include flex-center;

        @include desktop {
          border-radius: 20px;
          padding: 10px;
          width: 100px;
        }
        @include mobile {
          width: vw-base(160px);
          border-radius: vw-base(20px);
          padding: vw-base(20px);
          height: vw-base(40px);
        }
      }
      .title {
        font-weight: bold;

        @include desktop {
          font-size: 30px;
        }

        @include mobile {
          font-size: vw-base(40px);
        }
      }
      .row-name {
        @include flex-center;
        flex-direction: row;

        border: 1px solid black;

        @include desktop {
          padding: 10px;
          width: 100px;
        }
        @include mobile {
          width: vw-base(160px);
          padding: vw-base(20px);
          height: vw-base(40px);
        }

        .name {
          font-weight: bold;
          @include desktop {
            margin-left: 5px;
          }
          @include mobile {
            margin-left: vw-base(10px);
          }
        }
      }
    }

    .line-title {
      width: 100%;
      height: 6px;
      border-top: 1px solid black;
      border-bottom: 3px solid black;

      @include desktop {
        margin: 10px 0;
      }
      @include mobile {
        margin: vw-base(20px) 0;
      }
    }

    .col-answer {
      width: 100%;

      .answer-wrapper {
        @include desktop {
          margin-top: 10px;
        }

        @include mobile {
          margin-top: vw-base(20px);
        }
      }
    }
  }
  .row-home {
    @include flex-center;

    @include desktop {
      margin-top: 10px;
    }

    @include mobile {
      margin-top: vw-base(20px);
    }

    .btn-home {
      @include btn-primary;
    }
  }
}
</style>
