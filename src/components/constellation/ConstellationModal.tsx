import { useState, useEffect, useCallback } from 'react';
import { constellationNodes, constellationEdges, ConstellationNode } from '../../data/constellation';
import { getTrackById } from '../../data/releases';
import { WikiPanel } from '../wiki';
import './ConstellationModal.css';

interface ConstellationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NodePosition {
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

export default function ConstellationModal({ isOpen, onClose }: ConstellationModalProps) {
  const [selectedNode, setSelectedNode] = useState<ConstellationNode | null>(null);
  const [wikiEntryId, setWikiEntryId] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>({});
  const [isExploding, setIsExploding] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Animate nodes exploding outward on open
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Start with all nodes at center
      const centerPositions: Record<string, NodePosition> = {};
      constellationNodes.forEach(node => {
        centerPositions[node.id] = { x: 0.5, y: 0.5, scale: 0, opacity: 0 };
      });
      setNodePositions(centerPositions);

      // Trigger explosion animation
      setTimeout(() => {
        setIsExploding(true);
        const finalPositions: Record<string, NodePosition> = {};
        constellationNodes.forEach(node => {
          finalPositions[node.id] = { x: node.x, y: node.y, scale: 1, opacity: 1 };
        });
        setNodePositions(finalPositions);
      }, 100);
    } else {
      setIsExploding(false);
      setSelectedNode(null);
      setWikiEntryId(null);
      // Delay hiding to allow close animation
      setTimeout(() => setIsVisible(false), 500);
    }
  }, [isOpen]);

  const handleNodeClick = useCallback((node: ConstellationNode) => {
    setSelectedNode(node);
    setWikiEntryId(null); // Close wiki when selecting new node
  }, []);

  const handleWikiOpen = useCallback((entryId: string) => {
    setWikiEntryId(entryId);
  }, []);

  const handleCloseCard = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleCloseWiki = useCallback(() => {
    setWikiEntryId(null);
  }, []);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (wikiEntryId) {
        setWikiEntryId(null);
      } else if (selectedNode) {
        setSelectedNode(null);
      } else {
        onClose();
      }
    }
  }, [wikiEntryId, selectedNode, onClose]);

  // Get track info for selected node
  const getTrackInfo = (trackId: string) => {
    const result = getTrackById(trackId);
    return result ? { track: result.track, release: result.release } : null;
  };

  if (!isVisible) return null;

  return (
    <div
      className={`constellation-modal ${isOpen ? 'open' : 'closing'}`}
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <button className="constellation-close" onClick={onClose}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Title */}
      <div className="constellation-header">
        <h2 className="constellation-title">UNIVERSUM</h2>
        <p className="constellation-subtitle">Klicka på en stjärna för att utforska</p>
      </div>

      {/* Constellation view */}
      <div className="constellation-view">
        {/* Edges/Lines */}
        <svg className="constellation-edges" viewBox="0 0 100 100" preserveAspectRatio="none">
          {constellationEdges.map((edge, i) => {
            const fromPos = nodePositions[edge.from] || { x: 0.5, y: 0.5 };
            const toPos = nodePositions[edge.to] || { x: 0.5, y: 0.5 };
            const isConnectedToSelected = selectedNode &&
              (edge.from === selectedNode.id || edge.to === selectedNode.id);

            return (
              <line
                key={i}
                x1={fromPos.x * 100}
                y1={fromPos.y * 100}
                x2={toPos.x * 100}
                y2={toPos.y * 100}
                className={`edge edge-${edge.strength} ${isConnectedToSelected ? 'highlighted' : ''}`}
                style={{
                  transitionDelay: isExploding ? `${i * 50}ms` : '0ms',
                }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {constellationNodes.map((node, i) => {
          const pos = nodePositions[node.id] || { x: 0.5, y: 0.5, scale: 0, opacity: 0 };
          const isSelected = selectedNode?.id === node.id;

          return (
            <button
              key={node.id}
              className={`constellation-node node-${node.category} ${isSelected ? 'selected' : ''}`}
              style={{
                left: `${pos.x * 100}%`,
                top: `${pos.y * 100}%`,
                transform: `translate(-50%, -50%) scale(${pos.scale})`,
                opacity: pos.opacity,
                transitionDelay: isExploding ? `${i * 30}ms` : '0ms',
              }}
              onClick={() => handleNodeClick(node)}
            >
              <span className="node-glow" />
              <span className="node-core" />
              <span className="node-label">{node.label}</span>
            </button>
          );
        })}
      </div>

      {/* Song card */}
      {selectedNode && (
        <div className={`constellation-card ${wikiEntryId ? 'shifted' : ''}`}>
          <button className="card-close" onClick={handleCloseCard}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          <div className="card-header">
            <span className={`card-category category-${selectedNode.category}`}>
              {selectedNode.category === 'theme' && 'TEMA'}
              {selectedNode.category === 'character' && 'KARAKTÄR'}
              {selectedNode.category === 'concept' && 'KONCEPT'}
              {selectedNode.category === 'place' && 'PLATS'}
            </span>
            <h3 className="card-title">{selectedNode.label}</h3>
          </div>

          {/* Songs list */}
          <div className="card-songs">
            <span className="card-songs-label">FÖREKOMMER I</span>
            {selectedNode.trackIds.map(trackId => {
              const info = getTrackInfo(trackId);
              if (!info) return null;

              return (
                <div key={trackId} className="card-song">
                  {info.release.coverArt && (
                    <img
                      src={info.release.coverArt}
                      alt={info.release.title}
                      className="card-song-cover"
                    />
                  )}
                  <div className="card-song-info">
                    <span className="card-song-title">{info.track.title}</span>
                    <span className="card-song-album">{info.release.title}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Wiki button */}
          {selectedNode.wikiId && (
            <button
              className="card-wiki-btn"
              onClick={() => handleWikiOpen(selectedNode.wikiId!)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>LÄS MER I WIKI</span>
            </button>
          )}
        </div>
      )}

      {/* Wiki panel */}
      <WikiPanel
        entryId={wikiEntryId}
        isOpen={wikiEntryId !== null}
        onClose={handleCloseWiki}
        onEntryChange={setWikiEntryId}
      />
    </div>
  );
}
