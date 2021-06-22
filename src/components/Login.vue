<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-10">
        <h1>Employee Expenses</h1>
        <hr />
        <br />
        <alert :message="message"></alert>
        <button
          id="login_button"
          type="button"
          class="btn btn-success btn-sm"
          v-b-modal.login-modal
          v-show="loginButton"
        >
          Login</button
        >
        <button
          id="login_button"
          type="button"
          class="btn btn-secondary btn-sm"
          v-show="!loginButton"
          @click="logout"
        >
          Logout</button
        >
        &nbsp;
        <button
          id="post_button"
          type="button"
          class="btn btn-success btn-sm"
          v-b-modal.post-modal
          v-show="employee"
        >
          New Request</button>
        <button
          id="all_req"
          type="button"
          class="btn btn-primary btn-sm"
          @click="showAll"
          v-show="manager"
        >
          View All</button>
        &nbsp;
        <button
          id="pending_req"
          type="button"
          class="btn btn-primary btn-sm"
          @click="showPending"
          v-show="manager"
        >
          View Pending</button>
        &nbsp;
        <button
          id="completed_req"
          type="button"
          class="btn btn-primary btn-sm"
          @click="showCompleted"
          v-show="manager"
        >
          View Completed</button>
        <br /><br />
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col">Request</th>
              <th scope="col">Amount</th>
              <th scope="col">Approved?</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(expense, index) in expenses" :key="index">
              <td>{{ expense.request_details[0][1] }}</td>
              <td>{{ expense.request_amount }}</td>
              <td>
                <span v-if="expense.decision">Yes</span>
                <span v-else>No</span>
              </td>
              <td>
                <div class="btn-group" role="group">
                  <button
                    v-show="manager"
                    type="button"
                    class="btn btn-success btn-sm"
                    @click='approve(expense)'>
                    Approve
                  </button>&nbsp;
                  <button
                    v-show="manager"
                    type="button"
                    class="btn btn-danger btn-sm"
                    @click='deny(expense)'>
                    Deny
                  </button>&nbsp;
                  <button
                    type="button"
                    class="btn btn-warning btn-sm"
                    v-b-modal.edit-request
                    v-show="employee"
                    @click='editRequestId(expense)'
                  >
                    Edit
                  </button>&nbsp;
                  <button
                    type="button"
                    class="btn btn-primary btn-sm"
                    v-b-modal.edit-comment
                    @click='readComment(expense)'>
                    Comments
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <b-modal ref="loginModal" id="login-modal" title="Login" hide-footer>
      <b-form @submit="onSubmitLogin" @reset="onReset" class="w-100">
        <b-form-group
          id="form-email-group"
          label="Email:"
          label-for="form-title-input"
        >
          <b-form-input
            id="form-email-input"
            type="text"
            v-model="login.email"
            required
            placeholder="Enter email"
          >
          </b-form-input>
        </b-form-group>
        <b-form-group
          id="form-password-group"
          label="Password:"
          label-for="form-password-input"
        >
          <b-form-input
            id="form-password-input"
            type="text"
            v-model="login.password"
            required
            placeholder="Enter password"
          >
          </b-form-input>
        </b-form-group>
        <b-button-group>
          <b-button id="form-submit-button" type="submit" variant="primary"
            >Submit</b-button
          >
          <b-button id="form-reset-button" type="reset" variant="danger"
            >Reset</b-button
          >
        </b-button-group>
      </b-form>
    </b-modal>
    <b-modal ref="postModal" id="post-modal" title="Post" hide-footer>
      <b-form @submit="onSubmitPost" @reset="onReset" class="w-100">
        <b-form-group
          id="form-item-group"
          label="Item:"
          label-for="form-item-input"
        >
          <b-form-input
            id="form-item-input"
            type="text"
            v-model="post.item"
            required
            placeholder="Enter item"
          >
          </b-form-input>
        </b-form-group>
        <b-form-group
          id="form-amount-group"
          label="Amount:"
          label-for="form-amount-input"
        >
          <b-form-input
            id="form-amount-input"
            type="text"
            v-model="post.amount"
            required
            placeholder="Enter amount"
          >
          </b-form-input>
        </b-form-group>
        <b-button-group>
          <b-button type="submit" variant="primary">Submit</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </b-button-group>
      </b-form>
    </b-modal>
    <b-modal ref="editRequest"
            id="edit-request"
            title="Edit Request"
            hide-footer>
      <b-form @submit="editRequest" @reset="editReset" class="w-100">
      <b-form-group id="form-edit-item-group"
                    label="Request:"
                    label-for="form-edit-item-input">
          <b-form-input id="form-edit-item-input"
                        type="text"
                        v-model="editForm.item"
                        required
                        placeholder="Enter item">
          </b-form-input>
        </b-form-group>
        <b-form-group id="form-edit-amount-group"
                      label="Amount:"
                      label-for="form-edit-amount-input">
          <b-form-input id="form-edit-amount-input"
                        type="text"
                        v-model="editForm.amount"
                        required
                        placeholder="Enter amount">
          </b-form-input>
        </b-form-group>
        <b-button-group>
          <b-button type="submit" variant="primary">Update</b-button>
          <b-button type="reset" variant="danger">Cancel</b-button>
        </b-button-group>
      </b-form>
    </b-modal>
    <b-modal ref="postCommentModal"
            id="edit-comment"
            title="Edit Comment"
            hide-footer>
      <table class="table table-hover">
        <thead>
          <tr>
            <th scope="col">User</th>
            <th scope="col">Comment</th>
            <th scope="col">Time</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(comment, index) in comments" :key="index">
            <td>{{ comment[0] }}</td>
            <td>{{ comment[1] }}</td>
            <td>{{ comment[2] }}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <b-form @submit="postComment" @reset="commentReset" class="w-100">
      <b-form-group id="form-comment-group"
                    label="Comment:"
                    label-for="form-comment-input">
        <b-form-input id="form-comment-input"
                      type="text"
                      v-model="editComment.comment"
                      required
                      placeholder="Enter comment">
        </b-form-input>
      </b-form-group>
        <b-button-group>
          <b-button type="submit" variant="primary">Update</b-button>
          <b-button type="reset" variant="danger">Cancel</b-button>
        </b-button-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios';
import Alert from './Alert.vue';

export default {
  data() {
    return {
      message: '',
      token: '',
      user: {},
      loginButton: true,
      employee: false,
      manager: false,
      expenses: [],
      comments: [],
      getType: 'all',

      login: {
        email: '',
        password: '',
      },
      post: {
        amount: '',
        item: '',
      },
      editForm: {
        id: 0,
        item: '',
        amount: '',
      },
      editComment: {
        reqId: 0,
        comment: '',
      },
    };
  },
  components: {
    alert: Alert,
  },
  methods: {
    // login methods

    async getToken(payload) {
      const path = 'http://localhost:5000/login';
      try {
        const res = await axios.post(path, payload);
        this.token = res.data;
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    },

    async getUser() {
      const path = 'http://localhost:5000/employee/user';
      try {
        const res = await axios.get(path, { headers: { token: this.token } });
        this.user = res.data;
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    },

    // employee methods

    async getExpenses() {
      const path = 'http://localhost:5000/employee/request';
      await axios.get(path, { headers: { token: this.token } }).then((res) => {
        this.expenses = res.data;
      });
    },

    async postRequest(payload) {
      const path = 'http://localhost:5000/employee/request';

      try {
        await axios
          .post(path, payload, { headers: { token: this.token } });
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    },

    onSubmitPost(evt) {
      evt.preventDefault();
      this.$refs.postModal.hide();
      const payload = {
        amount: this.post.amount,
        comment: this.post.item,
      };
      this.postRequest(payload);
      this.initForm();
      this.getExpenses();
    },

    editRequestId(expense) {
      this.editForm.id = expense.id;
      const [request] = expense.request_details;
      const [, item] = request;
      this.editForm.item = item;
      this.editForm.amount = expense.request_amount;
    },

    editRequest(evt) {
      evt.preventDefault();
      this.$refs.editRequest.hide();

      const editPath = 'http://localhost:5000/employee/request';
      const editPayload = {
        req_id: this.editForm.id,
        req_amount: this.editForm.amount,
      };
      try {
        axios
          .patch(editPath, editPayload, { headers: { token: this.token } });
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }

      const commentPath = 'http://localhost:5000/employee/comment';
      const commentPayload = {
        req_id: this.editForm.id,
        comment: this.editForm.item,
        index: 0,
      };
      try {
        axios
          .patch(commentPath, commentPayload, { headers: { token: this.token } });
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }

      this.getExpenses();
    },

    async editReset(evt) {
      evt.preventDefault();
      this.$refs.editRequest.hide();
      this.initForm();
      this.getExpenses();
    },

    // manager methods

    showAll() {
      this.getType = 'all';
      this.getManagerExpenses();
    },

    showCompleted() {
      this.getType = 'completed';
      this.getManagerExpenses();
    },

    showPending() {
      this.getType = 'pending';
      this.getManagerExpenses();
    },

    async getManagerExpenses() {
      let path = '';

      switch (this.getType) {
        case 'all':
          path = 'http://localhost:5000/manager/request';
          break;
        case 'pending':
          path = 'http://localhost:5000/manager/request/pending';
          break;
        case 'completed':
          path = 'http://localhost:5000/manager/request/completed';
          break;
        default:
          break;
      }

      await axios.get(path, { headers: { token: this.token } }).then((res) => {
        this.expenses = res.data;
      });
    },

    async approve(expense) {
      const path = 'http://localhost:5000/manager/approve';
      const payload = {
        req_id: expense.id,
        decision: 'approve',
      };
      try {
        await axios
          .post(path, payload, { headers: { token: this.token } });
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
      this.getManagerExpenses();
    },

    async deny(expense) {
      const path = 'http://localhost:5000/manager/approve';
      const payload = {
        req_id: expense.id,
        decision: 'deny',
      };
      try {
        await axios
          .post(path, payload, { headers: { token: this.token } });
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
      this.getManagerExpenses();
    },

    // general methods

    initForm() {
      this.login.email = '';
      this.login.password = '';
      this.post.amount = '';
      this.post.item = '';
      this.editForm.id = 0;
      this.editForm.item = '';
      this.editForm.amount = '';
      this.editComment.comment = '';
      this.editComment.reqId = 0;
    },

    async onSubmitLogin(evt) {
      evt.preventDefault();
      this.$refs.loginModal.hide();
      const payload = {
        email: this.login.email,
        password: this.login.password,
      };
      await this.getToken(payload);
      await this.getUser();
      if (await this.user.status === 'employee') {
        this.employee = true;
        this.getExpenses();
      } else if (await this.user.status === 'manager') {
        this.manager = true;
        this.getManagerExpenses();
      }
      this.initForm();
      this.loginButton = false;
      this.message = `Welcome, ${this.user.first_name}!`;
    },

    async getComments(reqId) {
      let path = '';
      if (this.employee === true) {
        path = 'http://localhost:5000/employee/comment';
      } else if (this.manager === true) {
        path = 'http://localhost:5000/manager/comment';
      }
      try {
        const res = await axios.get(
          path,
          {
            headers: {
              token: this.token,
              req_id: reqId,
            },
          },
        );
        // eslint-disable-next-line
        this.comments = res.data;
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
    },

    readComment(expense) {
      this.editComment.reqId = expense.id;
      this.getComments(expense.id);
    },

    postComment(evt) {
      evt.preventDefault();
      let path = '';
      if (this.employee === true) {
        path = 'http://localhost:5000/employee/comment';
      } else if (this.manager === true) {
        path = 'http://localhost:5000/manager/comment';
      }
      const payload = {
        req_id: this.editComment.reqId,
        comment: this.editComment.comment,
      };
      try {
        axios.post(path, payload, { headers: { token: this.token } });
      } catch (error) {
        // eslint-disable-next-line
        console.log(error);
      }
      this.getComments(this.editComment.reqId);
    },

    commentReset(evt) {
      evt.preventDefault();
      this.$refs.postCommentModal.hide();
      this.initForm();
      this.getComments();
    },

    onReset(evt) {
      evt.preventDefault();
      this.$refs.loginModal.hide();
      this.$refs.postModal.hide();
      this.initForm();
      this.getExpenses();
    },

    logout(evt) {
      evt.preventDefault();
      this.message = 'Have a nice day!';
      this.token = '';
      this.user = {};
      this.loginButton = true;
      this.employee = false;
      this.manager = false;
      this.expenses = [];
      this.comments = [];
      this.getType = 'all';
    },
  },
  created() {
    this.message = 'Please log into the expenses portal.';
  },
};
</script>
