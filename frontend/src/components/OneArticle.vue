<template>
  <div>
    <div class="container">
      <button class="home btn btn-light text-right mb-3 mt-3 me-3">
        <b-icon class="me-2" icon="arrow-left-square"></b-icon>
        <router-link class="home" :to="{ name: 'allArticles' }"
          >Retour au fil d'actualité</router-link
        >
      </button>
      <div class="row">
        <div class="col">
          <div class="card mb-3">
            <div class="card-header">
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <img
                      class="rounded-circle"
                      width="45"
                      :src="loadImage(oneArticle.User.profile)"
                      :alt="oneArticle.title"
                    />
                  </div>
                  <div>
                    <div class="ms-2">{{ oneArticle.User.username }}</div>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <small class="mb-2">
                  <i class="fa fa-clock-o"></i>
                  {{ oneArticle.createdAt | filterFormatDate }}</small
                >
                <h5 class="card-title mt-2 mb-3 border-bottom">
                  {{ oneArticle.title }}
                </h5>
                <p class="card-text">{{ oneArticle.description }}</p>
                <div v-if="oneArticle.imageUrl">
                  <img
                    :src="oneArticle.imageUrl"
                    class="img-fluid img-thumbnail rounded mx-auto d-block"
                    :alt="oneArticle.title"
                  />
                </div>
              </div>
              <div class="card-footer border-bottom">
                <i class="fa fa-comment"></i>
                <span v-if="oneArticle.commentCount < 2" class="ms-2"
                  >{{ oneArticle.commentCount }} commentaire</span
                >
                <span v-else class="ms-2"
                  >{{ oneArticle.commentCount }} commentaires</span
                >
              </div>
            </div>
          </div>
          <!-- Input Comment -->
          <div class="container mt-2 mb-2">
            <div class="d-flex justify-content-center row">
              <div class="col-md-10">
                <div
                  class="d-flex flex-row align-items-center add-comment p-2 bg-white rounded"
                >
                  <img
                    class="rounded-circle"
                    :src="imgName('default.png')"
                    width="40"
                  />
                  <input
                    @keyup.enter="sendComment()"
                    v-model="commentInput.description"
                    type="text"
                    class="form-control ms-1"
                    placeholder="Votre commentaire..."
                    required
                  />

                  <button
                    v-on:click="sendComment()"
                    class="btn btn-success ms-2"
                  >
                    <b-icon type="button" icon="arrow-return-right"></b-icon>
                  </button>
                </div>
                <span v-show="nonValide" class="nonvalid"
                  >Veuillez remplire le champ</span
                >
                <!-- Comments -->
                <div
                  v-bind:key="index"
                  v-for="(commentaire, index) in allComments"
                  class="p-3 bg-white mt-2 rounded"
                >
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div class="d-flex flex-row">
                      <img
                        class="rounded-circle me-2"
                        :alt="commentaire.User.username"
                        :src="loadImage(commentaire.User.profile)"
                        width="45"
                      />
                      <div class="d-flex flex-column ml-2 ">
                        <span class="ms-1">{{
                          commentaire.User.username
                        }}</span>
                        <small class="ms-1">
                          <i class="fa fa-clock-o"></i>
                          {{ commentaire.createdAt | filterFormatDate }}
                        </small>
                      </div>
                    </div>
                    <b-dropdown
                      v-if="commentaire.UserId == userId"
                      id="dropdown-dropleft"
                      dropleft
                      variant="primary"
                      class="m-2 float-right"
                    >
                      <b-dropdown-item
                        v-on:click="deleteComment(commentaire.id, index)"
                        >Supprimer</b-dropdown-item
                      >
                    </b-dropdown>
                  </div>
                  <div class="text-justify mt-2 ">
                    <span>{{ commentaire.description }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "OneArticle",
  data() {
    return {
      commentInput: {
        description: "",
        userId: localStorage.getItem("userId"),
      },
      oneArticle: {},
      allComments: [],
      articleId: this.$route.params.id,
      username: localStorage.getItem("username"),
      //userPhoto: localStorage.getItem('userPhoto'),
      userId: localStorage.getItem("userId"),
      placeholder: false,
      nonValide: false,
    };
  },
  created() {
    this.loadArticle();
    this.loadComments();
  },
  methods: {
    loadArticle() {
      axios
        .get(`${process.env.VUE_APP_API_BACKEND_URL}post/${this.articleId}`, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        })
        .then((reponse) => {
          this.oneArticle = reponse.data;
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
    loadComments() {
      axios
        .get(
          `${process.env.VUE_APP_API_BACKEND_URL}comment/${this.articleId}/comments/`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((reponse) => {
          this.allComments = reponse.data;
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
    deleteComment(id, index) {
      axios
        .delete(`${process.env.VUE_APP_API_BACKEND_URL}comment/${id}/delete`, {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        })
        .then(() => {
          this.allComments.splice(index, 1);
          this.loadArticle();
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
    sendComment: function() {
      if (this.commentInput.description == "") {
        this.nonValide = true;
      } else {
        this.nonValide = false;
        axios
          .post(
            `${process.env.VUE_APP_API_BACKEND_URL}comment/${this.articleId}/new`,
            this.commentInput,
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          )
          .then(() => {
            this.loadComments();
            this.loadArticle();
            this.commentInput.description = null;
          })
          .catch((error) => {
            console.log(error.message);
          });
      }
    },
    imgName(filename) {
      return `${process.env.VUE_APP_API_BACKEND_URL}images/${filename}`;
    },
    loadImage(profile) {
      console.log(typeof profile);
      if (profile) {
        return profile;
      } else {
        return `${process.env.VUE_APP_API_BACKEND_URL}images/default.png`;
      }
    },
  },
  filters: {
    filterFormatDate: function(date) {
      let newDate = new Date(date);
      let hours = ("0" + newDate.getHours()).slice(-2);
      let mins = ("0" + newDate.getMinutes()).slice(-2);
      let month = ("0" + (newDate.getMonth() + 1)).slice(-2);
      let day = ("0" + newDate.getDate()).slice(-2);
      return (
        day +
        "/" +
        month +
        "/" +
        newDate.getFullYear() +
        " à " +
        hours +
        "h" +
        mins
      );
    },
  },
};
</script>

<style scoped>
.col {
  margin-bottom: 100px;
}

a {
  text-decoration: none;
  color: black;
}

h5 {
  cursor: initial;
}
</style>
