<template>
    <!-- Reset Password -->
    <div class="offcanvas offcanvas-end canvas-sidebar" id="reset">
        <div class="canvas-header">
            <h3 class="title fw-normal text-uppercase">Reset password</h3>
            <span class="icon-close link icon-close-popup" data-bs-dismiss="offcanvas"></span>
        </div>
        <div class="canvas-body">
            <p class="sub-title text-main-4">Please enter your registered email address to receive an email to reset
                your password</p>
            <form class="form-reset">
                <div class="form-content">
                    <fieldset class="tf-field">
                        <input class="tf-input" type="text" placeholder required>
                        <label class="tf-lable">Email *</label>
                    </fieldset>
                </div>
                <button type="submit" class="tf-btn btn-fill w-100 fw-medium animate-btn">
                    SUBMIT
                </button>
            </form>
        </div>
    </div>
    <!-- /Reset Password -->
</template>