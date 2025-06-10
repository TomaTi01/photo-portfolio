// Cursor tracking and image detection
const cursorPosition = { x: 0, y: 0 }
let isHoveringImage = false

// Initialize cursor tracking
function initCursor() {
  const cursor = document.getElementById("cursor")
  if (!cursor) return

  // Check if touch device
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0
  if (isTouchDevice) {
    cursor.style.display = "none"
    return
  }

  function updateCursorPosition(e) {
    cursorPosition.x = e.clientX
    cursorPosition.y = e.clientY
    cursor.style.left = cursorPosition.x + "px"
    cursor.style.top = cursorPosition.y + "px"
  }

  function isImageElement(element) {
    if (!element || !(element instanceof Element)) {
      return false
    }

    // Check if it's an image element or image container
    if (element.tagName === "IMG") {
      return true
    }

    // Check if it has .hoverable class
    if (element.matches && element.matches(".hoverable")) {
      return true
    }

    // Check parent elements
    const closestImageContainer = element.closest("img, .hoverable, [data-image]")
    return closestImageContainer !== null
  }

  function handleMouseOver(e) {
    if (isImageElement(e.target)) {
      isHoveringImage = true
      cursor.classList.add("on-image")
    } else {
      isHoveringImage = false
      cursor.classList.remove("on-image")
    }
  }

  function handleMouseOut(e) {
    if (isImageElement(e.target)) {
      isHoveringImage = false
      cursor.classList.remove("on-image")
    }
  }

  document.addEventListener("mousemove", updateCursorPosition)
  document.addEventListener("mouseover", handleMouseOver)
  document.addEventListener("mouseout", handleMouseOut)
}

// Contact dropdown functionality
function initContactDropdown() {
  const contactBtn = document.getElementById("contactBtn")
  const contactBtnDesktop = document.getElementById("contactBtnDesktop")
  const contactDropdown = document.getElementById("contactDropdown")
  const closeBtn = document.getElementById("closeBtn")
  const backdrop = document.getElementById("backdrop")

  function showDropdown() {
    contactDropdown.classList.add("show")
    backdrop.classList.add("show")
    if (contactBtn) contactBtn.classList.add("active")
    if (contactBtnDesktop) contactBtnDesktop.classList.add("active")
  }

  function hideDropdown() {
    contactDropdown.classList.remove("show")
    backdrop.classList.remove("show")
    if (contactBtn) contactBtn.classList.remove("active")
    if (contactBtnDesktop) contactBtnDesktop.classList.remove("active")
  }

  if (contactBtn) {
    contactBtn.addEventListener("click", showDropdown)
  }

  if (contactBtnDesktop) {
    contactBtnDesktop.addEventListener("click", showDropdown)
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", hideDropdown)
  }

  if (backdrop) {
    backdrop.addEventListener("click", hideDropdown)
  }
}

// Scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
      }
    })
  }, observerOptions)

  // Observe all fade-in elements
  document.querySelectorAll(".fade-in-up").forEach((el) => {
    observer.observe(el)
  })

  // Special observer for stagger children
  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
        }
      })
    },
    {
      threshold: 0.05,
      rootMargin: "0px 0px -100px 0px",
    },
  )

  document.querySelectorAll(".stagger-children").forEach((el) => {
    staggerObserver.observe(el)
  })
}

// Draggable gallery functionality
function initDraggableGalleries() {
  const galleries = document.querySelectorAll(".draggable-gallery")

  galleries.forEach((gallery) => {
    let isDragging = false
    let startX = 0
    let scrollLeft = 0

    function handleMouseDown(e) {
      isDragging = true
      startX = e.pageX - gallery.offsetLeft
      scrollLeft = gallery.scrollLeft
      gallery.classList.add("dragging")
    }

    function handleMouseUp() {
      isDragging = false
      gallery.classList.remove("dragging")
    }

    function handleMouseMove(e) {
      if (!isDragging) return
      e.preventDefault()
      const x = e.pageX - gallery.offsetLeft
      const walk = (x - startX) * 2
      gallery.scrollLeft = scrollLeft - walk
    }

    function handleTouchStart(e) {
      isDragging = true
      startX = e.touches[0].pageX - gallery.offsetLeft
      scrollLeft = gallery.scrollLeft
      gallery.classList.add("dragging")
    }

    function handleTouchMove(e) {
      if (!isDragging) return
      const x = e.touches[0].pageX - gallery.offsetLeft
      const walk = (x - startX) * 2
      gallery.scrollLeft = scrollLeft - walk
    }

    function handleTouchEnd() {
      isDragging = false
      gallery.classList.remove("dragging")
    }

    gallery.addEventListener("mousedown", handleMouseDown)
    gallery.addEventListener("mouseup", handleMouseUp)
    gallery.addEventListener("mouseleave", handleMouseUp)
    gallery.addEventListener("mousemove", handleMouseMove)
    gallery.addEventListener("touchstart", handleTouchStart)
    gallery.addEventListener("touchmove", handleTouchMove)
    gallery.addEventListener("touchend", handleTouchEnd)
  })
}

// Image modal functionality
function initImageModal() {
  const modal = document.getElementById("imageModal")
  const modalImage = document.getElementById("modalImage")
  const modalClose = document.getElementById("modalClose")
  const modalPrev = document.getElementById("modalPrev")
  const modalNext = document.getElementById("modalNext")
  const modalCounter = document.getElementById("modalCounter")
  const modalBackdrop = document.getElementById("modalBackdrop")

  if (!modal) return

  const gridItems = document.querySelectorAll(".grid-item[data-index]")
  const images = Array.from(gridItems).map((item) => {
    const img = item.querySelector("img")
    return {
      src: img.src,
      alt: img.alt,
    }
  })

  let currentIndex = 0

  function showModal(index) {
    currentIndex = index
    modalImage.src = images[currentIndex].src
    modalImage.alt = images[currentIndex].alt
    modalCounter.textContent = `${currentIndex + 1} / ${images.length}`
    modal.classList.add("show")
    document.body.style.overflow = "hidden"
  }

  function hideModal() {
    modal.classList.remove("show")
    document.body.style.overflow = "unset"
  }

  function showPrevious() {
    currentIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1
    modalImage.src = images[currentIndex].src
    modalImage.alt = images[currentIndex].alt
    modalCounter.textContent = `${currentIndex + 1} / ${images.length}`
  }

  function showNext() {
    currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0
    modalImage.src = images[currentIndex].src
    modalImage.alt = images[currentIndex].alt
    modalCounter.textContent = `${currentIndex + 1} / ${images.length}`
  }

  // Event listeners
  gridItems.forEach((item, index) => {
    item.addEventListener("click", () => showModal(index))
  })

  if (modalClose) {
    modalClose.addEventListener("click", hideModal)
  }

  if (modalPrev) {
    modalPrev.addEventListener("click", showPrevious)
  }

  if (modalNext) {
    modalNext.addEventListener("click", showNext)
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", hideModal)
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("show")) return

    switch (e.key) {
      case "Escape":
        hideModal()
        break
      case "ArrowLeft":
        e.preventDefault()
        showPrevious()
        break
      case "ArrowRight":
        e.preventDefault()
        showNext()
        break
    }
  })
}

// Initialize all functionality when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initCursor()
  initContactDropdown()
  initScrollAnimations()
  initDraggableGalleries()
  initImageModal()
})
