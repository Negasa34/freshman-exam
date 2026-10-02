import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function BookshelfScene({ books, activeId, onSelect }) {
  const mountRef = useRef(null)
  const selectRef = useRef(onSelect)
  const activeRef = useRef(activeId)
  useEffect(() => { selectRef.current = onSelect }, [onSelect])
  useEffect(() => { activeRef.current = activeId }, [activeId])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0.15, 17)
    camera.lookAt(0, 0, 0)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.HemisphereLight(0xc7d6c9, 0x221c18, 2))
    const keyLight = new THREE.DirectionalLight(0xffd5a0, 4.2)
    keyLight.position.set(-5, 8, 7)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.set(1024, 1024)
    scene.add(keyLight)
    const fillLight = new THREE.PointLight(0x8ab6a2, 20, 32, 2)
    fillLight.position.set(5, -1, 7)
    scene.add(fillLight)
    const movingLight = new THREE.PointLight(0xe4a46d, 28, 25, 2)
    movingLight.position.set(0, 2, 6)
    scene.add(movingLight)

    const wall = new THREE.Mesh(new THREE.BoxGeometry(20, 12, 0.8), new THREE.MeshStandardMaterial({ color: 0x26312b, roughness: 0.94 }))
    wall.position.set(0, 0, -1.5)
    wall.receiveShadow = true
    scene.add(wall)
    const wood = new THREE.MeshStandardMaterial({ color: 0x694b35, roughness: 0.72, metalness: 0.04 })
    const woodEdge = new THREE.MeshStandardMaterial({ color: 0x98714c, roughness: 0.55 })
    const addShelf = (x, y, width, height, depth, material) => {
      const plank = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material)
      plank.position.set(x, y, 0.05)
      plank.castShadow = true
      plank.receiveShadow = true
      scene.add(plank)
    }
    addShelf(0, 3.28, 15.2, 0.2, 0.95, wood)
    addShelf(0, 0.05, 15.2, 0.24, 1.15, woodEdge)
    addShelf(0, -3.2, 15.2, 0.24, 1.15, woodEdge)
    addShelf(-7.55, 0, 0.3, 6.7, 1, wood)
    addShelf(7.55, 0, 0.3, 6.7, 1, wood)
    addShelf(0, 3.05, 15, 0.07, 0.95, woodEdge)

    const bookGroups = []
    const bookMeshes = []
    const positions = [[-5.3, 0.05], [-1.8, 0.05], [1.8, 0.05], [5.3, 0.05], [-3.7, -3.2], [0, -3.2], [3.7, -3.2]]
    books.forEach((book, index) => {
      const group = new THREE.Group()
      const [x, shelfY] = positions[index % positions.length]
      const width = 0.76 + (index % 3) * 0.08
      const height = 1.72 + (index % 4) * 0.13
      group.position.set(x, shelfY + 0.13 + height / 2, 0.72)
      const spine = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.56), new THREE.MeshStandardMaterial({ color: book.color, roughness: 0.63, metalness: 0.05, emissive: book.color, emissiveIntensity: book.id === activeRef.current ? 0.22 : 0.035 }))
      spine.castShadow = true
      spine.receiveShadow = true
      spine.userData.bookId = book.id
      group.add(spine)

      const labelCanvas = document.createElement('canvas')
      labelCanvas.width = 128
      labelCanvas.height = 512
      const context = labelCanvas.getContext('2d')
      context.fillStyle = book.color
      context.fillRect(0, 0, 128, 512)
      context.fillStyle = 'rgba(20, 22, 18, 0.16)'
      context.fillRect(8, 0, 8, 512)
      context.save()
      context.translate(64, 256)
      context.rotate(-Math.PI / 2)
      context.fillStyle = '#f7ecd7'
      context.font = '600 22px Georgia'
      context.textAlign = 'center'
      context.textBaseline = 'middle'
      context.fillText(book.title.length > 26 ? `${book.title.slice(0, 24)}…` : book.title, 0, 0, 440)
      context.restore()
      const texture = new THREE.CanvasTexture(labelCanvas)
      texture.colorSpace = THREE.SRGBColorSpace
      const label = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.72, height * 0.82), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }))
      label.position.z = 0.286
      label.userData.bookId = book.id
      group.add(label)
      const cap = new THREE.Mesh(new THREE.BoxGeometry(width * 0.7, 0.025, 0.018), new THREE.MeshStandardMaterial({ color: 0xd2b67d, metalness: 0.55, roughness: 0.36 }))
      cap.position.set(0, height * 0.36, 0.3)
      group.add(cap)
      group.userData.bookId = book.id
      group.userData.baseY = group.position.y
      group.userData.phase = index * 0.7
      scene.add(group)
      bookGroups.push(group)
      bookMeshes.push(spine, label)
    })

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    const target = new THREE.Vector2()
    let hoveredId = null
    const setPointer = (event) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      target.set(pointer.x, pointer.y)
    }
    const onMove = (event) => {
      setPointer(event)
      raycaster.setFromCamera(pointer, camera)
      hoveredId = raycaster.intersectObjects(bookMeshes, false)[0]?.object.userData.bookId ?? null
      renderer.domElement.style.cursor = hoveredId ? 'pointer' : 'default'
    }
    const onClick = () => { if (hoveredId !== null) selectRef.current(hoveredId) }
    const onLeave = () => { target.set(0, 0); hoveredId = null; renderer.domElement.style.cursor = 'default' }
    renderer.domElement.addEventListener('pointermove', onMove)
    renderer.domElement.addEventListener('pointerleave', onLeave)
    renderer.domElement.addEventListener('click', onClick)

    let animationFrame = 0
    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate)
      const elapsed = performance.now() / 1000
      camera.position.x += (target.x * 0.52 - camera.position.x) * 0.035
      camera.position.y += (0.15 + target.y * 0.25 - camera.position.y) * 0.035
      camera.lookAt(target.x * 0.24, target.y * 0.12, 0)
      movingLight.position.x += (target.x * 7 - movingLight.position.x) * 0.045
      movingLight.position.y += (target.y * 4 + 1 - movingLight.position.y) * 0.045
      bookGroups.forEach((group) => {
        const active = group.userData.bookId === activeRef.current
        const hovered = group.userData.bookId === hoveredId
        group.position.y = group.userData.baseY + Math.sin(elapsed * 0.7 + group.userData.phase) * 0.018
        group.rotation.y += ((hovered ? -0.09 : 0) - group.rotation.y) * 0.08
        const spine = group.children[0]
        spine.material.emissiveIntensity += ((active ? 0.27 : hovered ? 0.16 : 0.035) - spine.material.emissiveIntensity) * 0.08
      })
      renderer.render(scene, camera)
    }
    animate()
    const resize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.fov = camera.aspect < 0.72 ? 47 : 38
      camera.position.z = camera.aspect < 0.72 ? 21 : 17
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', resize)
    resize()

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', resize)
      renderer.domElement.removeEventListener('pointermove', onMove)
      renderer.domElement.removeEventListener('pointerleave', onLeave)
      renderer.domElement.removeEventListener('click', onClick)
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => { material.map?.dispose(); material.dispose() })
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [books])

  return <div className="bookshelf-canvas" ref={mountRef} aria-label="Interactive 3D library bookshelf" />
}

export default BookshelfScene