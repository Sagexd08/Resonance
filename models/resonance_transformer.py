"""
Resonance Transformer Model Architecture
A custom transformer for emotional pattern analysis and recommendation generation.
"""

import torch
import torch.nn as nn
import torch.nn.functional as F
import math
import json
import sys
from typing import Optional, List, Dict, Any


class PositionalEncoding(nn.Module):
    """Sinusoidal positional encoding for sequence position awareness."""
    
    def __init__(self, d_model: int, max_len: int = 512, dropout: float = 0.1):
        super().__init__()
        self.dropout = nn.Dropout(p=dropout)
        
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
        
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        pe = pe.unsqueeze(0)                         
        
        self.register_buffer('pe', pe)
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        x = x + self.pe[:, :x.size(1), :]
        return self.dropout(x)


class MultiHeadSelfAttention(nn.Module):
    """Multi-head self-attention mechanism."""
    
    def __init__(self, d_model: int, n_heads: int, dropout: float = 0.1):
        super().__init__()
        assert d_model % n_heads == 0, "d_model must be divisible by n_heads"
        
        self.d_model = d_model
        self.n_heads = n_heads
        self.d_k = d_model // n_heads
        
        self.w_q = nn.Linear(d_model, d_model)
        self.w_k = nn.Linear(d_model, d_model)
        self.w_v = nn.Linear(d_model, d_model)
        self.w_o = nn.Linear(d_model, d_model)
        
        self.dropout = nn.Dropout(dropout)
        self.scale = math.sqrt(self.d_k)
    
    def forward(
        self, 
        x: torch.Tensor, 
        mask: Optional[torch.Tensor] = None
    ) -> torch.Tensor:
        batch_size, seq_len, _ = x.shape
        
                            
        q = self.w_q(x).view(batch_size, seq_len, self.n_heads, self.d_k).transpose(1, 2)
        k = self.w_k(x).view(batch_size, seq_len, self.n_heads, self.d_k).transpose(1, 2)
        v = self.w_v(x).view(batch_size, seq_len, self.n_heads, self.d_k).transpose(1, 2)
        
                                      
        attn_scores = torch.matmul(q, k.transpose(-2, -1)) / self.scale
        
        if mask is not None:
            attn_scores = attn_scores.masked_fill(mask == 0, float('-inf'))
        
        attn_probs = F.softmax(attn_scores, dim=-1)
        attn_probs = self.dropout(attn_probs)
        
                                   
        context = torch.matmul(attn_probs, v)
        context = context.transpose(1, 2).contiguous().view(batch_size, seq_len, self.d_model)
        
        return self.w_o(context)


class FeedForward(nn.Module):
    """Position-wise feed-forward network."""
    
    def __init__(self, d_model: int, d_ff: int, dropout: float = 0.1):
        super().__init__()
        self.linear1 = nn.Linear(d_model, d_ff)
        self.linear2 = nn.Linear(d_ff, d_model)
        self.dropout = nn.Dropout(dropout)
        self.gelu = nn.GELU()
    
    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.linear2(self.dropout(self.gelu(self.linear1(x))))


class TransformerEncoderLayer(nn.Module):
    """Single transformer encoder layer with pre-norm architecture."""
    
    def __init__(self, d_model: int, n_heads: int, d_ff: int, dropout: float = 0.1):
        super().__init__()
        self.self_attn = MultiHeadSelfAttention(d_model, n_heads, dropout)
        self.ff = FeedForward(d_model, d_ff, dropout)
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.dropout = nn.Dropout(dropout)
    
    def forward(self, x: torch.Tensor, mask: Optional[torch.Tensor] = None) -> torch.Tensor:
                                               
        attn_out = self.self_attn(self.norm1(x), mask)
        x = x + self.dropout(attn_out)
        
                                             
        ff_out = self.ff(self.norm2(x))
        x = x + self.dropout(ff_out)
        
        return x


class EmotionalFeatureEncoder(nn.Module):
    """Encodes emotional signals (mood, energy, stress) into embeddings."""
    
    def __init__(self, d_model: int):
        super().__init__()
                                        
        self.mood_proj = nn.Linear(1, d_model // 3)
        self.energy_proj = nn.Linear(1, d_model // 3)
        self.stress_proj = nn.Linear(1, d_model // 3 + d_model % 3)
        
                                                       
        self.day_embed = nn.Embedding(7, d_model // 4)
        self.hour_embed = nn.Embedding(24, d_model // 4)
        
                              
        self.combine = nn.Linear(d_model + d_model // 2, d_model)
        self.norm = nn.LayerNorm(d_model)
    
    def forward(
        self, 
        mood: torch.Tensor,                       
        energy: torch.Tensor,                     
        stress: torch.Tensor,                     
        day_of_week: torch.Tensor,                
        hour_of_day: torch.Tensor                 
    ) -> torch.Tensor:
                                    
        mood_emb = self.mood_proj(mood)
        energy_emb = self.energy_proj(energy)
        stress_emb = self.stress_proj(stress)
        
                                  
        day_emb = self.day_embed(day_of_week)
        hour_emb = self.hour_embed(hour_of_day)
        
                                    
        combined = torch.cat([mood_emb, energy_emb, stress_emb, day_emb, hour_emb], dim=-1)
        
        return self.norm(self.combine(combined))


class ResonanceTransformer(nn.Module):
    """
    Main Resonance Transformer model for emotional pattern analysis.
    
    Architecture:
    - EmotionalFeatureEncoder: Converts raw signals to embeddings
    - Positional Encoding: Adds sequence position information
    - N Transformer Encoder Layers: Learn temporal patterns
    - Output Heads: Generate predictions/recommendations
    """
    
    def __init__(
        self,
        d_model: int = 256,
        n_heads: int = 8,
        n_layers: int = 6,
        d_ff: int = 1024,
        max_seq_len: int = 90,                              
        n_risk_classes: int = 4,                                         
        n_recommendations: int = 10,                                   
        dropout: float = 0.1
    ):
        super().__init__()
        
        self.d_model = d_model
        self.feature_encoder = EmotionalFeatureEncoder(d_model)
        self.pos_encoding = PositionalEncoding(d_model, max_seq_len, dropout)
        
        self.encoder_layers = nn.ModuleList([
            TransformerEncoderLayer(d_model, n_heads, d_ff, dropout)
            for _ in range(n_layers)
        ])
        
        self.final_norm = nn.LayerNorm(d_model)
        
                      
        self.risk_head = nn.Sequential(
            nn.Linear(d_model, d_model // 2),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(d_model // 2, n_risk_classes)
        )
        
        self.burnout_head = nn.Sequential(
            nn.Linear(d_model, d_model // 2),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(d_model // 2, 1),
            nn.Sigmoid()                          
        )
        
        self.recommendation_head = nn.Sequential(
            nn.Linear(d_model, d_model),
            nn.GELU(),
            nn.Dropout(dropout),
            nn.Linear(d_model, n_recommendations)
        )
        
                            
        self._init_weights()
    
    def _init_weights(self):
        for p in self.parameters():
            if p.dim() > 1:
                nn.init.xavier_uniform_(p)
    
    def forward(
        self,
        mood: torch.Tensor,
        energy: torch.Tensor,
        stress: torch.Tensor,
        day_of_week: torch.Tensor,
        hour_of_day: torch.Tensor,
        mask: Optional[torch.Tensor] = None
    ) -> Dict[str, torch.Tensor]:
                                   
        x = self.feature_encoder(mood, energy, stress, day_of_week, hour_of_day)
        
                                 
        x = self.pos_encoding(x)
        
                                         
        for layer in self.encoder_layers:
            x = layer(x, mask)
        
        x = self.final_norm(x)
        
                                                             
        last_hidden = x[:, -1, :]                    
        
                          
        risk_logits = self.risk_head(last_hidden)
        burnout_prob = self.burnout_head(last_hidden)
        recommendation_logits = self.recommendation_head(last_hidden)
        
        return {
            'risk_logits': risk_logits,
            'risk_probs': F.softmax(risk_logits, dim=-1),
            'burnout_probability': burnout_prob,
            'recommendation_logits': recommendation_logits,
            'recommendation_probs': F.softmax(recommendation_logits, dim=-1),
            'hidden_state': last_hidden
        }
    
    def get_risk_category(self, risk_probs: torch.Tensor) -> List[str]:
        """Convert risk probabilities to category names."""
        categories = ['thriving', 'stable', 'struggling', 'at-risk']
        indices = risk_probs.argmax(dim=-1).tolist()
        if isinstance(indices, int):
            indices = [indices]
        return [categories[i] for i in indices]


                          
RECOMMENDATION_TEMPLATES = [
    "Schedule a brief mindfulness break during peak stress hours.",
    "Consider a walking meeting to boost both energy and engagement.",
    "Recognize recent achievements to maintain positive momentum.",
    "Suggest flexible working hours during high-stress periods.",
    "Organize a team social activity to improve morale.",
    "Provide additional support resources for struggling team members.",
    "Review workload distribution to prevent burnout.",
    "Encourage regular check-ins with team members showing declining trends.",
    "Implement a 'no-meeting' focus time block.",
    "Celebrate team wins to boost collective mood.",
]


def load_model(checkpoint_path: Optional[str] = None) -> ResonanceTransformer:
    """Load the model, optionally from a checkpoint."""
    model = ResonanceTransformer()
    
    if checkpoint_path:
        try:
            state_dict = torch.load(checkpoint_path, map_location='cpu')
            model.load_state_dict(state_dict)
            print(f"Loaded model from {checkpoint_path}", file=sys.stderr)
        except Exception as e:
            print(f"Warning: Could not load checkpoint: {e}", file=sys.stderr)
    
    model.eval()
    return model


def generate_recommendations(model: ResonanceTransformer, context: Dict[str, Any]) -> List[str]:
    """Generate recommendations based on context."""
                                                                        
                                                          
    
    avg_mood = context.get('avgMood', 3.0)
    burnout_index = context.get('burnoutIndex', 30.0)
    
    recommendations = []
    
    if burnout_index > 60:
        recommendations.append(RECOMMENDATION_TEMPLATES[6])                   
        recommendations.append(RECOMMENDATION_TEMPLATES[3])                  
    
    if avg_mood < 2.5:
        recommendations.append(RECOMMENDATION_TEMPLATES[5])                     
        recommendations.append(RECOMMENDATION_TEMPLATES[7])             
    elif avg_mood < 3.5:
        recommendations.append(RECOMMENDATION_TEMPLATES[0])               
        recommendations.append(RECOMMENDATION_TEMPLATES[4])               
    else:
        recommendations.append(RECOMMENDATION_TEMPLATES[2])                          
        recommendations.append(RECOMMENDATION_TEMPLATES[9])                  
    
                                   
    recommendations.append(RECOMMENDATION_TEMPLATES[8])              
    
    return recommendations[:5]                


def main():
    """CLI interface for the recommendation engine."""
    try:
                               
        input_data = json.load(sys.stdin)
        
        org_id = input_data.get('orgId', '')
        context = input_data.get('context', {})
        
                                                
        model = load_model()
        
                                  
        recommendations = generate_recommendations(model, context)
        
                        
        print(json.dumps(recommendations))
        
    except Exception as e:
                                  
        fallback = [
            "Encourage regular breaks to maintain well-being.",
            "Schedule team sync to align on priorities.",
            "Promote work-life balance practices."
        ]
        print(json.dumps(fallback))
        print(f"Error: {e}", file=sys.stderr)


if __name__ == "__main__":
    main()
