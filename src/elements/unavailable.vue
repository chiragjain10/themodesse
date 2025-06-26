<template>
    <!-- Unavailable -->
    <div class=" modal modalCentered fade modal-unavailable" id="unavailable">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <span class="icon-close-popup" data-bs-dismiss="modal">
                    <i class="icon-close"></i>
                </span>
                <div class="tf-product-notify">
                    <h4 class="title">Notify me when it back in stock</h4>
                    <p class="sub-title text-main-6">Enter your email address to be notified if the product becomes
                        available
                        again.</p>
                    <form class="style-border form-notify">
                        <div class="form-content-2">
                            <input type="text" required placeholder="Name">
                            <input type="text" required placeholder="Email*">
                        </div>
                        <button type="submit" class="tf-btn btn-fill-2 w-100 fw-medium animate-btn">
                            submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- /Unavailable -->
</template>