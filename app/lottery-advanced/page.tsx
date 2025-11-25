"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { FaDiceD20, FaChevronUp, FaPlus, FaTimes, FaPlay, FaTrophy } from 'react-icons/fa';

// --- TYPES ---
interface Participant {
    id: number;
    name: string;
    weight: number;
}

interface HistoryItem {
    name: string;
    time: string;
}

interface Settings {
    removeWinner: boolean;
    mode: 'wheel' | 'random';
}

// --- CONSTANTS ---
const COLORS = [
    0x3b82f6, 0x8b5cf6, 0xec4899, 0xf43f5e, 0xf59e0b, 0x10b981, 0x06b6d4
];

export default function LotteryPage() {
    // --- STATE ---
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [settings, setSettings] = useState<Settings>({ removeWinner: false, mode: 'wheel' });
    const [isSpinning, setIsSpinning] = useState(false);
    const [sidebarMinimized, setSidebarMinimized] = useState(false);
    const [activeTab, setActiveTab] = useState<'participants' | 'settings' | 'history'>('participants');
    
    // Inputs
    const [inputName, setInputName] = useState('');
    const [inputWeight, setInputWeight] = useState(1);

    // Winner Modal
    const [winner, setWinner] = useState<Participant | null>(null);
    const [showModal, setShowModal] = useState(false);

    // --- REFS (Three.js) ---
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const wheelGroupRef = useRef<THREE.Group | null>(null);
    const particlesGroupRef = useRef<THREE.Group | null>(null);
    const pointerGroupRef = useRef<THREE.Group | null>(null);
    const particlesRef = useRef<THREE.Points | null>(null);
    
    // Animation State Refs
    const wheelRotationRef = useRef(0);
    const reqIdRef = useRef<number | null>(null);
    const fluxIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // --- INITIALIZATION & EFFECTS ---

    // Load Data
    useEffect(() => {
        const savedParticipants = localStorage.getItem('lottery_participants');
        if (savedParticipants) {
            setParticipants(JSON.parse(savedParticipants));
        } else {
            setParticipants([
                { id: 1, name: 'Alice', weight: 1 },
                { id: 2, name: 'Bob', weight: 1 },
                { id: 3, name: 'Charlie', weight: 2 }, 
                { id: 4, name: 'David', weight: 1 }
            ]);
        }

        const savedHistory = localStorage.getItem('lottery_history');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    // Save Data
    useEffect(() => {
        localStorage.setItem('lottery_participants', JSON.stringify(participants));
        buildWheel();
    }, [participants]);

    useEffect(() => {
        localStorage.setItem('lottery_history', JSON.stringify(history));
    }, [history]);

    // Three.js Setup
    useEffect(() => {
        if (!containerRef.current) return;

        // Scene
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0f172a, 0.02);
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 8;
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(5, 10, 7);
        scene.add(dirLight);
        
        const pointLight = new THREE.PointLight(0x3b82f6, 1, 50);
        pointLight.position.set(0, 0, 5);
        scene.add(pointLight);

        // Groups
        const wheelGroup = new THREE.Group();
        const particlesGroup = new THREE.Group();
        scene.add(wheelGroup);
        scene.add(particlesGroup);
        wheelGroupRef.current = wheelGroup;
        particlesGroupRef.current = particlesGroup;

        // Pointer
        const pointerGroup = new THREE.Group();
        const pHeadGeo = new THREE.ConeGeometry(0.6, 1.2, 32);
        const pMat = new THREE.MeshStandardMaterial({ 
            color: 0xffd700, metalness: 0.9, roughness: 0.1, emissive: 0x332200
        });
        const pHead = new THREE.Mesh(pHeadGeo, pMat);
        pHead.position.y = 0.6;

        const pShaftGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.2, 32);
        const pShaft = new THREE.Mesh(pShaftGeo, pMat);
        pShaft.position.y = -0.6;

        pointerGroup.add(pHead);
        pointerGroup.add(pShaft);
        pointerGroup.position.y = -4.2; 
        pointerGroup.position.z = 0.5;
        scene.add(pointerGroup);
        pointerGroupRef.current = pointerGroup;

        // Particles
        const partGeo = new THREE.BufferGeometry();
        const partCount = 500;
        const posArray = new Float32Array(partCount * 3);
        for(let i=0; i<partCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 50;
        }
        partGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const partMat = new THREE.PointsMaterial({
            size: 0.1, color: 0x4f46e5, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending
        });
        const particles = new THREE.Points(partGeo, partMat);
        particlesGroup.add(particles);
        particlesRef.current = particles;

        // Animation Loop
        let time = 0;
        const animate = () => {
            reqIdRef.current = requestAnimationFrame(animate);
            time += 0.005;

            if (particlesGroupRef.current && particlesRef.current) {
                particlesGroupRef.current.rotation.y = time * 0.2;
                particlesRef.current.rotation.z = time * 0.1;
            }

            if (!isSpinning && settings.mode === 'wheel' && wheelGroupRef.current) {
                wheelGroupRef.current.rotation.x = Math.sin(time) * 0.1;
                wheelGroupRef.current.rotation.y = Math.cos(time) * 0.1;
            }

            renderer.render(scene, camera);
        };
        animate();

        // Resize Handler
        const handleResize = () => {
            if (!cameraRef.current || !rendererRef.current) return;
            cameraRef.current.aspect = window.innerWidth / window.innerHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, []); // Run once on mount

    // Rebuild Wheel when participants change
    const buildWheel = useCallback(() => {
        if (!wheelGroupRef.current) return;
        
        const wheelGroup = wheelGroupRef.current;
        
        // Clear existing
        while(wheelGroup.children.length > 0){ 
            const child = wheelGroup.children[0] as THREE.Mesh;
            if(child.geometry) child.geometry.dispose();
            if(child.material) {
                if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                else (child.material as THREE.Material).dispose();
            }
            wheelGroup.remove(child); 
        }

        if (participants.length === 0) return;

        const totalWeight = participants.reduce((acc, p) => acc + p.weight, 0);
        let startAngle = 0;
        const radius = 3.5;
        const height = 0.5;

        participants.forEach((p, index) => {
            const angle = (p.weight / totalWeight) * Math.PI * 2;
            
            // Slice
            const geometry = new THREE.CylinderGeometry(radius, radius, height, 32, 1, false, startAngle, angle);
            const material = new THREE.MeshStandardMaterial({ 
                color: COLORS[index % COLORS.length],
                metalness: 0.3,
                roughness: 0.4
            });
            const slice = new THREE.Mesh(geometry, material);
            slice.rotation.x = Math.PI / 2;
            wheelGroup.add(slice);

            // Text
            const midAngle = startAngle + (angle / 2);
            const textTex = createTextTexture(p.name);
            const textGeo = new THREE.PlaneGeometry(3, 0.75);
            const textMat = new THREE.MeshBasicMaterial({ 
                map: textTex, transparent: true, side: THREE.DoubleSide
            });
            const textMesh = new THREE.Mesh(textGeo, textMat);

            const textRadius = radius * 0.6;
            textMesh.position.set(
                Math.cos(midAngle) * textRadius, 
                Math.sin(midAngle) * textRadius, 
                (height / 2) + 0.05
            );
            textMesh.rotation.z = midAngle;

            let normAngle = midAngle % (Math.PI * 2);
            if (normAngle > Math.PI / 2 && normAngle < Math.PI * 1.5) {
                    textMesh.rotation.z += Math.PI;
            }

            wheelGroup.add(textMesh);
            startAngle += angle;
        });

        wheelGroup.rotation.z = wheelRotationRef.current % (Math.PI * 2);
    }, [participants]);

    // Update Mode (Camera Position)
    useEffect(() => {
        if (!cameraRef.current || !pointerGroupRef.current || !wheelGroupRef.current) return;

        if (settings.mode === 'wheel') {
            pointerGroupRef.current.visible = true;
            wheelGroupRef.current.visible = true;
            gsapCamera({x:0, y:0, z:8});
        } else {
            pointerGroupRef.current.visible = false;
            wheelGroupRef.current.visible = false;
            gsapCamera({x:0, y:0, z:20});
        }
    }, [settings.mode]);


    // --- HELPERS ---

    const createTextTexture = (text: string) => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (!ctx) return new THREE.CanvasTexture(canvas);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 50px Segoe UI, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        return texture;
    };

    const gsapCamera = (targetPos: {x:number, y:number, z:number}) => {
        if (!cameraRef.current) return;
        const startPos = cameraRef.current.position.clone();
        let progress = 0;
        
        const move = () => {
            progress += 0.02;
            if(progress > 1) progress = 1;
            const ease = 1 - Math.pow(1 - progress, 3);
            
            if (cameraRef.current) {
                cameraRef.current.position.x = startPos.x + (targetPos.x - startPos.x) * ease;
                cameraRef.current.position.y = startPos.y + (targetPos.y - startPos.y) * ease;
                cameraRef.current.position.z = startPos.z + (targetPos.z - startPos.z) * ease;
            }
            
            if (progress < 1) requestAnimationFrame(move);
        };
        move();
    };

    // --- ACTIONS ---

    const addParticipant = () => {
        if (!inputName || inputWeight < 1) return;
        
        const lines = inputName.split(/\r?\n/);
        const newParticipants: Participant[] = [];
        
        lines.forEach((line, index) => {
            const name = line.trim();
            if (name) {
                newParticipants.push({
                    id: Date.now() + index,
                    name,
                    weight: inputWeight
                });
            }
        });

        if (newParticipants.length > 0) {
            setParticipants(prev => [...prev, ...newParticipants]);
            setInputName('');
            setInputWeight(1);
        }
    };

    const removeParticipant = (id: number) => {
        setParticipants(prev => prev.filter(p => p.id !== id));
    };

    const clearParticipants = () => {
        if (confirm("Are you sure you want to remove all participants?")) {
            setParticipants([]);
        }
    };

    const clearHistory = () => {
        setHistory([]);
    };

    const startLottery = () => {
        if (isSpinning || participants.length === 0) return;
        setIsSpinning(true);

        const totalWeight = participants.reduce((acc, p) => acc + p.weight, 0);
        let random = Math.random() * totalWeight;
        let winnerIndex = 0;
        
        for (let i = 0; i < participants.length; i++) {
            if (random < participants[i].weight) {
                winnerIndex = i;
                break;
            }
            random -= participants[i].weight;
        }

        const winner = participants[winnerIndex];

        if (settings.mode === 'wheel') {
            spinWheelAnimation(winnerIndex, winner, totalWeight);
        } else {
            randomFluxAnimation(winner, totalWeight);
        }
    };

    const spinWheelAnimation = (winnerIndex: number, winner: Participant, totalWeight: number) => {
        if (!wheelGroupRef.current) return;

        let currentAngle = 0;
        for(let i=0; i<winnerIndex; i++){
            currentAngle += (participants[i].weight / totalWeight) * Math.PI * 2;
        }
        const winnerSliceAngle = (winner.weight / totalWeight) * Math.PI * 2;
        const winnerCenter = currentAngle + (winnerSliceAngle / 2);

        const targetBase = (3 * Math.PI / 2) - winnerCenter;
        const startRotation = wheelGroupRef.current.rotation.z;
        
        const normalize = (angle: number) => {
            let a = angle % (Math.PI * 2);
            return a >= 0 ? a : a + (Math.PI * 2);
        };
        
        const currentMod = normalize(startRotation);
        const targetMod = normalize(targetBase);
        
        let dist = targetMod - currentMod;
        if (dist < 0) dist += Math.PI * 2;
        
        const spins = 10;
        const totalRotation = dist + (spins * Math.PI * 2);
        
        const change = totalRotation;
        const duration = 5000;
        const startTime = Date.now();

        const spin = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            
            if (wheelGroupRef.current) {
                wheelGroupRef.current.rotation.z = startRotation + (change * ease);
            }

            if (progress < 1) {
                requestAnimationFrame(spin);
            } else {
                if (wheelGroupRef.current) {
                    wheelRotationRef.current = wheelGroupRef.current.rotation.z % (Math.PI * 2);
                }
                finishLottery(winner, totalWeight);
            }
        };
        spin();
    };

    const randomFluxAnimation = (winner: Participant, totalWeight: number) => {
        const fluxDisplay = document.getElementById('flux-name');
        if (!fluxDisplay) return;

        const duration = 2000;
        const startTime = Date.now();
        
        fluxIntervalRef.current = setInterval(() => {
            const rIndex = Math.floor(Math.random() * participants.length);
            fluxDisplay.innerText = participants[rIndex].name;
            fluxDisplay.style.opacity = (Math.random() * 0.5 + 0.5).toString();
            
            if (cameraRef.current) {
                cameraRef.current.position.x += (Math.random() - 0.5) * 0.1;
            }
        }, 50);

        const run = () => {
            if (Date.now() - startTime < duration) {
                requestAnimationFrame(run);
                if (particlesGroupRef.current) {
                    particlesGroupRef.current.rotation.y += 0.1;
                }
            } else {
                if (fluxIntervalRef.current) clearInterval(fluxIntervalRef.current);
                fluxDisplay.innerText = winner.name;
                fluxDisplay.style.opacity = '1';
                if (cameraRef.current) cameraRef.current.position.x = 0;
                finishLottery(winner, totalWeight);
            }
        };
        run();
    };

    const finishLottery = (winner: Participant, totalWeight: number) => {
        setIsSpinning(false);
        setWinner(winner);
        setShowModal(true);
        
        // Confetti
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        // History
        setHistory(prev => [...prev, {
            name: winner.name,
            time: new Date().toLocaleTimeString()
        }]);

        // Remove Winner
        if (settings.removeWinner) {
            removeParticipant(winner.id);
        }
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-slate-900 text-white font-sans">
            {/* 3D Canvas */}
            <div ref={containerRef} className="absolute top-0 left-0 w-full h-full z-[1]" />

            {/* UI Overlay */}
            <div className="absolute top-0 left-0 w-full h-full z-10 flex flex-col md:flex-row pointer-events-none">
                
                {/* Sidebar */}
                <div 
                    className={`
                        pointer-events-auto w-full md:w-96 h-full 
                        bg-slate-900/85 backdrop-blur-md border-r border-white/10
                        flex flex-col shadow-2xl transition-all duration-400 ease-out
                        ${sidebarMinimized ? 'max-h-[80px] md:max-h-full md:w-[80px]' : ''}
                    `}
                >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-slate-900 shrink-0 h-[80px]">
                        <div className={`flex items-center gap-2 ${sidebarMinimized ? 'hidden md:hidden' : ''}`}>
                            <h1 className="text-xl font-bold text-blue-400 flex items-center">
                                <FaDiceD20 className="mr-2" /> BNFN Lottery
                            </h1>
                        </div>
                        {/* Minimized Icon Only */}
                        <div className={`hidden ${sidebarMinimized ? 'md:flex w-full justify-center' : ''}`}>
                             <FaDiceD20 className="text-2xl text-blue-400" />
                        </div>

                        <div className={`flex items-center gap-3 ${sidebarMinimized ? 'hidden' : ''}`}>
                            <div className="text-xs text-gray-400">
                                Total W: {participants.reduce((a, b) => a + b.weight, 0)}
                            </div>
                            <button 
                                onClick={() => setSidebarMinimized(!sidebarMinimized)} 
                                className="text-gray-400 hover:text-white transition focus:outline-none"
                            >
                                <FaChevronUp className={`transform transition-transform ${sidebarMinimized ? 'rotate-180' : ''}`} />
                            </button>
                        </div>
                    </div>

                    {/* Content (Hidden when minimized) */}
                    <div className={`flex-1 flex flex-col overflow-hidden ${sidebarMinimized ? 'hidden' : ''}`}>
                        
                        {/* Tabs */}
                        <div className="flex border-b border-gray-700 bg-slate-800 shrink-0">
                            {(['participants', 'settings', 'history'] as const).map(tab => (
                                <button 
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`
                                        flex-1 py-3 text-sm font-medium transition-colors
                                        ${activeTab === tab ? 'bg-slate-700 text-blue-400' : 'hover:bg-slate-700 text-gray-400'}
                                    `}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto p-4 relative">
                            
                            {/* Participants */}
                            {activeTab === 'participants' && (
                                <div className="space-y-4">
                                    <div className="flex gap-2 items-start">
                                        <textarea 
                                            value={inputName}
                                            onChange={(e) => setInputName(e.target.value)}
                                            placeholder="Names (one per line)" 
                                            rows={1} 
                                            className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-y min-h-[40px]"
                                        />
                                        <input 
                                            type="number" 
                                            value={inputWeight}
                                            onChange={(e) => setInputWeight(parseInt(e.target.value) || 1)}
                                            placeholder="Wt" 
                                            min="1" 
                                            className="w-16 bg-slate-900 border border-slate-600 rounded px-2 py-2 text-sm focus:outline-none focus:border-blue-500 h-[40px]"
                                        />
                                        <button 
                                            onClick={addParticipant} 
                                            className="bg-blue-600 hover:bg-blue-500 px-3 rounded text-white transition h-[40px] flex items-center justify-center"
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                    
                                    <div className="flex justify-end">
                                        <button onClick={clearParticipants} className="text-xs text-red-400 hover:text-red-300 transition">
                                            Clear All
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {participants.length === 0 && (
                                            <div className="text-gray-500 text-center py-4">No participants</div>
                                        )}
                                        {participants.map((p, index) => {
                                            const totalW = participants.reduce((a,b)=>a+b.weight,0);
                                            const pct = ((p.weight / totalW) * 100).toFixed(1);
                                            const color = '#' + COLORS[index % COLORS.length].toString(16).padStart(6, '0');
                                            
                                            return (
                                                <div key={p.id} className="flex items-center justify-between bg-slate-800 p-2 rounded border-l-4 hover:bg-slate-750 transition" style={{ borderLeftColor: color }}>
                                                    <div className="flex flex-col overflow-hidden">
                                                        <span className="font-medium truncate text-gray-200">
                                                            <span className="text-gray-500 mr-2 text-xs">#{index + 1}</span>{p.name}
                                                        </span>
                                                        <span className="text-xs text-gray-500">Weight: {p.weight} ({pct}%)</span>
                                                    </div>
                                                    <button onClick={() => removeParticipant(p.id)} className="text-gray-600 hover:text-red-400 p-1">
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Settings */}
                            {activeTab === 'settings' && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label htmlFor="mode-select" className="block text-sm font-semibold text-gray-300">Visualization Mode</label>
                                        <select 
                                            id="mode-select"
                                            value={settings.mode}
                                            onChange={(e) => setSettings({...settings, mode: e.target.value as any})}
                                            className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm"
                                        >
                                            <option value="wheel">3D Wheel of Fortune</option>
                                            <option value="random">Cyber Random Flux</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-slate-800 rounded">
                                        <span className="text-sm" id="remove-winner-label">Remove Winner</span>
                                        <label className="relative inline-flex items-center cursor-pointer" aria-labelledby="remove-winner-label">
                                            <input 
                                                type="checkbox" 
                                                checked={settings.removeWinner}
                                                onChange={(e) => setSettings({...settings, removeWinner: e.target.checked})}
                                                className="sr-only peer" 
                                            />
                                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500">If enabled, winners are removed from the pool automatically.</p>
                                </div>
                            )}

                            {/* History */}
                            {activeTab === 'history' && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-bold text-gray-300">Recent Winners</span>
                                        <button onClick={clearHistory} className="text-xs text-red-400 hover:text-red-300">Clear</button>
                                    </div>
                                    <ul className="space-y-2 text-sm">
                                        {history.length === 0 && <li className="text-gray-500 text-center italic">No history yet</li>}
                                        {history.slice().reverse().map((h, i) => (
                                            <li key={i} className="flex justify-between items-center bg-slate-800 p-2 rounded text-xs">
                                                <span className="text-blue-300 font-bold">{h.name}</span>
                                                <span className="text-gray-500">{h.time}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Footer Action */}
                        <div className="p-4 border-t border-gray-700 bg-slate-900 z-20 shrink-0">
                            <button 
                                onClick={startLottery}
                                disabled={isSpinning || participants.length === 0}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded font-bold shadow-lg transform transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                <FaPlay className="mr-2" /> START LOTTERY
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side / Overlay info */}
                <div className="flex-1 pointer-events-none relative flex items-center justify-center">
                    {/* Random Flux Name Display */}
                    <div 
                        id="flux-display" 
                        className={`text-center ${settings.mode === 'random' ? '' : 'hidden'}`}
                    >
                        <h2 
                            id="flux-name"
                            className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 filter drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]"
                        >
                            READY
                        </h2>
                    </div>
                </div>
            </div>

            {/* Winner Modal */}
            {showModal && winner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
                    <div 
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
                        onClick={() => setShowModal(false)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowModal(false); }}
                        aria-label="Close modal"
                    />
                    <div className="bg-slate-900 border-2 border-yellow-500 rounded-xl p-8 max-w-md w-full text-center shadow-[0_0_50px_rgba(234,179,8,0.3)] transform scale-100 transition-all z-10">
                        <div className="text-6xl text-yellow-500 mb-4 flex justify-center"><FaTrophy /></div>
                        <h2 className="text-2xl font-bold text-white mb-1">WINNER!</h2>
                        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-500 py-4 break-words">
                            {winner.name}
                        </div>
                        <p className="text-gray-400 text-sm mb-6">
                            Chance: {((winner.weight / participants.reduce((a,b)=>a+b.weight,0)) * 100).toFixed(1)}%
                        </p>
                        <div className="flex gap-3 justify-center">
                            <button 
                                onClick={() => setShowModal(false)} 
                                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded text-white transition"
                            >
                                Close
                            </button>
                            <button 
                                onClick={() => {
                                    setShowModal(false);
                                    startLottery();
                                }} 
                                className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold rounded transition"
                            >
                                Spin Again
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
